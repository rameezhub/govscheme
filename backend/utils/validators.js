const { body, query, param } = require('express-validator');
const {
  INDIAN_STATES, CATEGORIES, OCCUPATIONS,
  EDUCATION_LEVELS, SCHEME_CATEGORIES, SUPPORTED_LANGUAGES
} = require('../config/constants');

// ─── Auth ─────────────────────────────────────────────────────────────────────
const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').normalizeEmail().isEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and a number'),
  body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('annualIncome').isFloat({ min: 0 }).withMessage('Annual income must be a non-negative number'),
  body('occupation').isIn(OCCUPATIONS).withMessage(`Occupation must be one of: ${OCCUPATIONS.join(', ')}`),
  body('state').isIn(INDIAN_STATES).withMessage('Please select a valid Indian state'),
  body('category').isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('educationLevel').isIn(EDUCATION_LEVELS).withMessage(`Education level must be one of: ${EDUCATION_LEVELS.join(', ')}`),
  body('preferredLanguage').optional().isIn(SUPPORTED_LANGUAGES)
];

const loginValidator = [
  body('email').normalizeEmail().isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
];

// ─── User profile ─────────────────────────────────────────────────────────────
const updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('age').optional().isInt({ min: 1, max: 120 }),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('annualIncome').optional().isFloat({ min: 0 }),
  body('occupation').optional().isIn(OCCUPATIONS),
  body('state').optional().isIn(INDIAN_STATES),
  body('category').optional().isIn(CATEGORIES),
  body('educationLevel').optional().isIn(EDUCATION_LEVELS),
  body('preferredLanguage').optional().isIn(SUPPORTED_LANGUAGES)
];

// ─── Scheme create/update ──────────────────────────────────────────────────────
const createSchemeValidator = [
  body('name.en').notEmpty().withMessage('English scheme name is required'),
  body('description.en').notEmpty().withMessage('English description is required'),
  body('benefits.en').notEmpty().withMessage('English benefits are required'),
  body('category').isIn(SCHEME_CATEGORIES).withMessage(`Category must be one of: ${SCHEME_CATEGORIES.join(', ')}`),
  body('eligibility.minAge').optional().isInt({ min: 0 }),
  body('eligibility.maxAge').optional().isInt({ min: 0, max: 150 }),
  body('eligibility.maxIncome').optional().isFloat({ min: 0 }),
  body('eligibility.allowedStates').optional().isArray()
    .custom(vals => vals.every(v => v === 'All' || INDIAN_STATES.includes(v)))
    .withMessage('allowedStates must contain valid Indian states or "All"'),
  body('eligibility.allowedGenders').optional().isArray()
    .custom(vals => vals.every(v => ['male','female','other','All'].includes(v)))
    .withMessage('allowedGenders must be male, female, other, or All'),
  body('eligibility.categories').optional().isArray(),
  body('eligibility.occupations').optional().isArray(),
  body('officialLink').optional().isURL().withMessage('Must be a valid URL')
];

// ─── Pagination + filter query params ─────────────────────────────────────────
// Used by GET /api/schemes and GET /api/schemes/search
const paginationValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('lang').optional().isIn(SUPPORTED_LANGUAGES),

  // State filter — must be a valid state name OR 'All'
  query('state').optional()
    .custom(val => val === 'All' || val === 'All States' || INDIAN_STATES.includes(val))
    .withMessage('state must be a valid Indian state'),

  // Gender filter — must be one of the allowed values
  query('gender').optional()
    .isIn(['all', 'male', 'female', 'other'])
    .withMessage('gender must be all, male, female, or other'),

  // Income filter — optional numeric
  query('maxIncome').optional()
    .isFloat({ min: 0 })
    .withMessage('maxIncome must be a non-negative number'),

  // Category filter
  query('category').optional()
    .isIn(SCHEME_CATEGORIES)
    .withMessage(`category must be one of: ${SCHEME_CATEGORIES.join(', ')}`)
];

const schemeIdValidator = [
  param('id').isMongoId().withMessage('Invalid scheme ID')
];

module.exports = {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  createSchemeValidator,
  paginationValidator,
  schemeIdValidator
};
