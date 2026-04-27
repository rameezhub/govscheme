const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = catchAsync(async (req, res, next) => {
  const {
    name, email, password, age, gender, annualIncome,
    occupation, state, category, educationLevel, preferredLanguage
  } = req.body;

  // Check duplicate email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered. Please log in.', 409));
  }

  const user = await User.create({
    name, email, password, age, gender, annualIncome,
    occupation, state, category, educationLevel,
    preferredLanguage: preferredLanguage || 'en'
  });

  const token = user.generateJWT();

  // Remove password from output
  user.password = undefined;

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    data: { user }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check credentials
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Contact support.', 401));
  }

  const token = user.generateJWT();
  user.password = undefined;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    data: { user }
  });
});

/**
 * @desc    Get current logged-in user (token validation check)
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('-__v');
  res.status(200).json({
    success: true,
    data: { user }
  });
});

module.exports = { register, login, getMe };
