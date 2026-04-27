const { SUPPORTED_LANGUAGES } = require('../config/constants');

/**
 * Resolves the desired response language from:
 *   1. ?lang= query param
 *   2. Accept-Language header
 *   3. Authenticated user's preferredLanguage
 *   4. Default: 'en'
 *
 * Sets req.lang for use in controllers.
 */
const languageMiddleware = (req, res, next) => {
  // 1. Explicit query param wins
  if (req.query.lang && SUPPORTED_LANGUAGES.includes(req.query.lang)) {
    req.lang = req.query.lang;
    return next();
  }

  // 2. Authenticated user preference
  if (req.user?.preferredLanguage && SUPPORTED_LANGUAGES.includes(req.user.preferredLanguage)) {
    req.lang = req.user.preferredLanguage;
    return next();
  }

  // 3. Accept-Language header (take first segment, e.g. "hi-IN" → "hi")
  const acceptLang = req.headers['accept-language'];
  if (acceptLang) {
    const primary = acceptLang.split(',')[0].split('-')[0].trim().toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(primary)) {
      req.lang = primary;
      return next();
    }
  }

  // 4. Fallback
  req.lang = 'en';
  next();
};

module.exports = languageMiddleware;
