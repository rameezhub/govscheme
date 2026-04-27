const Scheme = require('../models/Scheme');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { INDIAN_STATES } = require('../config/constants');

/**
 * @desc    Get all schemes — supports filtering by category, state, gender, income
 * @route   GET /api/schemes
 * @query   category, state, gender, maxIncome, page, limit, sort, lang
 * @access  Public
 */
const getAllSchemes = catchAsync(async (req, res) => {
  const lang = req.query.lang || req.user?.preferredLanguage || 'en';

  // ── Build MongoDB filter ────────────────────────────────────────────────────
  const filter = { isActive: true };

  // Category filter
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // State filter — match schemes that allow 'All' OR the specified state
  if (req.query.state && req.query.state !== 'All') {
    filter['eligibility.allowedStates'] = {
      $in: ['All', req.query.state]
    };
  }

  // Gender filter — match schemes that allow 'All' OR the specified gender
  if (req.query.gender && req.query.gender !== 'all') {
    filter['eligibility.allowedGenders'] = {
      $in: ['All', req.query.gender]
    };
  }

  // Max income filter — show schemes where scheme's maxIncome >= user's income
  // (i.e. user is within the income limit), or schemes with no income limit
  if (req.query.maxIncome) {
    const income = parseFloat(req.query.maxIncome);
    if (!isNaN(income)) {
      filter.$or = [
        { 'eligibility.maxIncome': null },
        { 'eligibility.maxIncome': { $gte: income } }
      ];
    }
  }

  // ── Pagination ──────────────────────────────────────────────────────────────
  const page  = Math.max(parseInt(req.query.page,  10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const skip  = (page - 1) * limit;

  const [total, schemes] = await Promise.all([
    Scheme.countDocuments(filter),
    Scheme.find(filter)
      .select('-__v')
      .sort(req.query.sort || '-createdAt')
      .skip(skip)
      .limit(limit)
      .lean(false)
  ]);

  res.status(200).json({
    success: true,
    data: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
      filters: {
        category:  req.query.category  || null,
        state:     req.query.state     || null,
        gender:    req.query.gender    || null,
        maxIncome: req.query.maxIncome || null,
      },
      schemes: schemes.map(s => s.getLocalized(lang))
    }
  });
});

/**
 * @desc    Get single scheme by ID
 * @route   GET /api/schemes/:id
 * @access  Public
 */
const getSchemeById = catchAsync(async (req, res, next) => {
  const lang = req.query.lang || req.user?.preferredLanguage || 'en';
  const scheme = await Scheme.findOne({ _id: req.params.id, isActive: true }).select('-__v');
  if (!scheme) return next(new AppError('Scheme not found.', 404));
  res.status(200).json({ success: true, data: { scheme: scheme.getLocalized(lang) } });
});

/**
 * @desc    Full-text search schemes (name + description)
 * @route   GET /api/schemes/search?q=keyword
 * @query   q, state, gender, category, page, limit, lang
 * @access  Public
 */
const searchSchemes = catchAsync(async (req, res, next) => {
  const { q, lang = 'en' } = req.query;
  if (!q || q.trim().length < 2) {
    return next(new AppError('Search query must be at least 2 characters.', 400));
  }

  const page  = Math.max(parseInt(req.query.page,  10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const skip  = (page - 1) * limit;

  // Build filter — text search + optional state/gender refinement
  const filter = {
    $text: { $search: q },
    isActive: true
  };

  if (req.query.category) filter.category = req.query.category;

  if (req.query.state && req.query.state !== 'All') {
    filter['eligibility.allowedStates'] = { $in: ['All', req.query.state] };
  }
  if (req.query.gender && req.query.gender !== 'all') {
    filter['eligibility.allowedGenders'] = { $in: ['All', req.query.gender] };
  }

  const schemes = await Scheme.find(filter, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit)
    .select('-__v');

  res.status(200).json({
    success: true,
    data: {
      count: schemes.length,
      page,
      query: q,
      schemes: schemes.map(s => s.getLocalized(lang))
    }
  });
});

/**
 * @desc    Get scheme categories with counts
 * @route   GET /api/schemes/categories
 * @access  Public
 */
const getCategories = catchAsync(async (req, res) => {
  const categories = await Scheme.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.status(200).json({ success: true, data: { categories } });
});

/**
 * @desc    Get available states that have at least one scheme
 * @route   GET /api/schemes/states
 * @access  Public
 */
const getStatesWithSchemes = catchAsync(async (req, res) => {
  const result = await Scheme.aggregate([
    { $match: { isActive: true } },
    { $unwind: '$eligibility.allowedStates' },
    { $group: { _id: '$eligibility.allowedStates', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  // Separate "All" (pan-India) from state-specific
  const allIndiaCount = result.find(r => r._id === 'All')?.count || 0;
  const stateSpecific = result
    .filter(r => r._id !== 'All')
    .map(r => ({ state: r._id, schemeCount: r.count }));

  res.status(200).json({
    success: true,
    data: {
      allIndiaSchemes: allIndiaCount,
      stateSpecific,
      allStates: INDIAN_STATES
    }
  });
});

/**
 * @desc    Get gender-wise scheme summary
 * @route   GET /api/schemes/genders
 * @access  Public
 */
const getGenderSummary = catchAsync(async (req, res) => {
  const result = await Scheme.aggregate([
    { $match: { isActive: true } },
    { $unwind: '$eligibility.allowedGenders' },
    { $group: { _id: '$eligibility.allowedGenders', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      summary: result.map(r => ({
        gender: r._id,
        schemeCount: r.count,
        label: r._id === 'All' ? 'All Genders' :
               r._id === 'male' ? 'Male' :
               r._id === 'female' ? 'Female' : 'Other'
      }))
    }
  });
});

/**
 * @desc    Create a new scheme
 * @route   POST /api/schemes
 * @access  Private/Admin
 */
const createScheme = catchAsync(async (req, res, next) => {
  if (req.body.schemeCode) {
    const exists = await Scheme.findOne({ schemeCode: req.body.schemeCode.toUpperCase() });
    if (exists) return next(new AppError('Scheme code already exists.', 409));
  }
  const scheme = await Scheme.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({
    success: true,
    message: 'Scheme created successfully',
    data: { scheme }
  });
});

/**
 * @desc    Update a scheme
 * @route   PUT /api/schemes/:id
 * @access  Private/Admin
 */
const updateScheme = catchAsync(async (req, res, next) => {
  const scheme = await Scheme.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  );
  if (!scheme) return next(new AppError('Scheme not found.', 404));
  res.status(200).json({ success: true, message: 'Scheme updated successfully', data: { scheme } });
});

/**
 * @desc    Soft-delete (deactivate) a scheme
 * @route   DELETE /api/schemes/:id
 * @access  Private/Admin
 */
const deleteScheme = catchAsync(async (req, res, next) => {
  const scheme = await Scheme.findByIdAndUpdate(
    req.params.id, { isActive: false }, { new: true }
  );
  if (!scheme) return next(new AppError('Scheme not found.', 404));
  res.status(200).json({ success: true, message: 'Scheme deactivated successfully' });
});

module.exports = {
  getAllSchemes, getSchemeById, createScheme,
  updateScheme, deleteScheme, searchSchemes,
  getCategories, getStatesWithSchemes, getGenderSummary
};
