const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

// FIX #1: Removed .select('+password') — password hash should NOT be on req.user
// for every authenticated route. Only auth-specific routes need it.
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('Not authenticated. Please log in.', 401));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'JsonWebTokenError') return next(new AppError('Invalid token.', 401));
      if (err.name === 'TokenExpiredError') return next(new AppError('Token expired. Please log in again.', 401));
      return next(new AppError('Authentication failed.', 401));
    }

    // FIX #1: No +password here — req.user stays safe for all downstream routes
    const user = await User.findById(decoded.id).select('-password -__v');
    if (!user) return next(new AppError('User belonging to this token no longer exists.', 401));
    if (!user.isActive) return next(new AppError('Your account has been deactivated.', 401));

    // changedPasswordAfter needs passwordChangedAt field (always present, not password itself)
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('Password changed recently. Please log in again.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Role '${req.user.role}' is not authorized for this action.`, 403));
    }
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -__v');
    if (user && user.isActive) req.user = user;
    next();
  } catch {
    next();
  }
};

module.exports = { protect, authorize, optionalAuth };
