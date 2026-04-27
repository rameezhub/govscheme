const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Fields users are not allowed to self-update
const PROTECTED_FIELDS = ['role', 'email', 'password', 'isActive', 'savedSchemes', 'passwordChangedAt'];

/**
 * @desc    Get user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-__v')
    .populate({ path: 'savedSchemes', select: 'name.en category isActive' });

  res.status(200).json({
    success: true,
    data: { user }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
const updateProfile = catchAsync(async (req, res, next) => {
  // Strip protected fields
  const filteredBody = { ...req.body };
  PROTECTED_FIELDS.forEach((field) => delete filteredBody[field]);

  if (Object.keys(filteredBody).length === 0) {
    return next(new AppError('No valid fields provided to update.', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    filteredBody,
    { new: true, runValidators: true }
  ).select('-__v');

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});

/**
 * @desc    Save a scheme to user's list
 * @route   POST /api/user/saved-schemes/:schemeId
 * @access  Private
 */
const saveScheme = catchAsync(async (req, res, next) => {
  const { schemeId } = req.params;
  const user = await User.findById(req.user._id);

  if (user.savedSchemes.map(String).includes(schemeId)) {
    return next(new AppError('Scheme already saved.', 409));
  }

  user.savedSchemes.push(schemeId);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Scheme saved successfully',
    data: { savedSchemes: user.savedSchemes }
  });
});

/**
 * @desc    Remove a scheme from user's saved list
 * @route   DELETE /api/user/saved-schemes/:schemeId
 * @access  Private
 */
const removeSavedScheme = catchAsync(async (req, res) => {
  const { schemeId } = req.params;
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { savedSchemes: schemeId }
  });

  res.status(200).json({
    success: true,
    message: 'Scheme removed from saved list'
  });
});

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/user/all
 * @access  Private/Admin
 */
const getAllUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const users = await User.find()
    .select('-__v')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      total,
      page,
      pages: Math.ceil(total / limit),
      users
    }
  });
});

/**
 * @desc    Deactivate own account
 * @route   DELETE /api/user/profile
 * @access  Private
 */
const deactivateAccount = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(200).json({
    success: true,
    message: 'Account deactivated. Contact support to reactivate.'
  });
});

module.exports = {
  getProfile, updateProfile, saveScheme,
  removeSavedScheme, getAllUsers, deactivateAccount
};
