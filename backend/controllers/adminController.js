const User = require('../models/User');
const Scheme = require('../models/Scheme');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const getAnalytics = catchAsync(async (req, res) => {
  const [
    totalUsers,
    totalSchemes,
    activeSchemes,
    usersByState,
    usersByCategory,
    usersByOccupation,
    usersByGender,
    schemesByCategory,
    recentUsers,
    incomeDistribution
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Scheme.countDocuments(),
    Scheme.countDocuments({ isActive: true }),

    User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),

    User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),

    User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$occupation', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),

    User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]),

    Scheme.aggregate([
      { $group: { _id: '$category', total: { $sum: 1 }, active: { $sum: { $cond: ['$isActive', 1, 0] } } } },
      { $sort: { total: -1 } }
    ]),

    User.find({ role: 'user' })
      .sort('-createdAt')
      .limit(5)
      .select('name email state occupation createdAt'),

    // FIX #9: Replaced Infinity boundary with a very large number (Number.MAX_SAFE_INTEGER
    // not supported in MongoDB $bucket). Use 99999999 as practical upper bound (₹~1 Crore+).
    User.aggregate([
      { $match: { role: 'user' } },
      {
        $bucket: {
          groupBy: '$annualIncome',
          boundaries: [0, 100000, 250000, 500000, 1000000, 2500000, 9999999999],
          default: 'Above 25L',
          output: { count: { $sum: 1 } }
        }
      }
    ])
  ]);

  const incomeLabels = ['0–1L', '1–2.5L', '2.5–5L', '5–10L', '10–25L', '25L+'];
  const incomeStats = incomeDistribution.map((bucket, i) => ({
    range: incomeLabels[i] || bucket._id,
    count: bucket.count
  }));

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalSchemes,
        activeSchemes,
        inactiveSchemes: totalSchemes - activeSchemes
      },
      users: {
        byState: usersByState,
        byCategory: usersByCategory,
        byOccupation: usersByOccupation,
        byGender: usersByGender,
        incomeDistribution: incomeStats,
        recentSignups: recentUsers
      },
      schemes: {
        byCategory: schemesByCategory
      }
    }
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId)
    .select('-__v -password')
    .populate({ path: 'savedSchemes', select: 'name.en category isActive' });

  if (!user) return next(new AppError('User not found.', 404));
  res.status(200).json({ success: true, data: { user } });
});

const toggleUserStatus = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) return next(new AppError('User not found.', 404));
  if (user.role === 'admin') return next(new AppError('Cannot modify admin accounts.', 403));

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: { userId: user._id, isActive: user.isActive }
  });
});

const bulkToggleSchemes = catchAsync(async (req, res, next) => {
  const { schemeIds, isActive } = req.body;

  if (!Array.isArray(schemeIds) || schemeIds.length === 0) {
    return next(new AppError('Provide an array of schemeIds.', 400));
  }
  if (typeof isActive !== 'boolean') {
    return next(new AppError('isActive must be a boolean.', 400));
  }

  const result = await Scheme.updateMany({ _id: { $in: schemeIds } }, { isActive });

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} scheme(s) updated`,
    data: { modifiedCount: result.modifiedCount }
  });
});

const getAllSchemesAdmin = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const total = await Scheme.countDocuments(filter);
  const schemes = await Scheme.find(filter)
    .sort(req.query.sort || '-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email')
    .select('-__v');

  res.status(200).json({
    success: true,
    data: { total, page, pages: Math.ceil(total / limit), schemes }
  });
});

module.exports = {
  getAnalytics,
  getUserById,
  toggleUserStatus,
  bulkToggleSchemes,
  getAllSchemesAdmin
};
