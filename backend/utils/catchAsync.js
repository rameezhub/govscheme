/**
 * Wraps async route handlers to automatically forward errors to Express error middleware.
 */
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = catchAsync;
