const express = require('express');
const router = express.Router();

const {
  getPersonalizedRecommendations,
  checkSchemeEligibility,
  getRecommendationSummary
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { paginationValidator, schemeIdValidator } = require('../utils/validators');
const { param } = require('express-validator');

// All recommendation routes require authentication
router.use(protect);

/**
 * @route   GET /api/recommendations
 * @desc    Get personalized scheme recommendations for the logged-in user
 * @access  Private
 * @query   lang, category, page, limit
 */
router.get('/', paginationValidator, validate, getPersonalizedRecommendations);

/**
 * @route   GET /api/recommendations/summary
 * @desc    Get recommendation summary stats (counts per category, top matches)
 * @access  Private
 */
router.get('/summary', getRecommendationSummary);

/**
 * @route   GET /api/recommendations/check/:schemeId
 * @desc    Check if user is eligible for a specific scheme
 * @access  Private
 */
router.get(
  '/check/:schemeId',
  [param('schemeId').isMongoId().withMessage('Invalid scheme ID')],
  validate,
  checkSchemeEligibility
);

module.exports = router;
