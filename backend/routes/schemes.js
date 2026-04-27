const express = require('express');
const router  = express.Router();

const {
  getAllSchemes, getSchemeById, createScheme,
  updateScheme, deleteScheme, searchSchemes,
  getCategories, getStatesWithSchemes, getGenderSummary
} = require('../controllers/schemeController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createSchemeValidator,
  paginationValidator,
  schemeIdValidator
} = require('../utils/validators');

// ─── Public read-only routes ─────────────────────────────────────────────────

/**
 * @route   GET /api/schemes/search
 * @desc    Full-text search with optional state/gender/category refinement
 * @query   q, state, gender, category, page, limit, lang
 */
router.get('/search', paginationValidator, validate, searchSchemes);

/**
 * @route   GET /api/schemes/categories
 * @desc    Category list with scheme counts
 */
router.get('/categories', getCategories);

/**
 * @route   GET /api/schemes/states
 * @desc    States that have schemes + All India count
 */
router.get('/states', getStatesWithSchemes);

/**
 * @route   GET /api/schemes/genders
 * @desc    Gender-wise scheme summary counts
 */
router.get('/genders', getGenderSummary);

// ─── Collection routes ────────────────────────────────────────────────────────

/**
 * @route   GET  /api/schemes
 * @desc    All schemes with filtering (category, state, gender, maxIncome)
 * @query   category, state, gender, maxIncome, page, limit, sort, lang
 *
 * @route   POST /api/schemes
 * @desc    Create scheme (admin only)
 */
router
  .route('/')
  .get(optionalAuth, paginationValidator, validate, getAllSchemes)
  .post(protect, authorize('admin'), createSchemeValidator, validate, createScheme);

// ─── Single scheme routes ─────────────────────────────────────────────────────

/**
 * @route   GET    /api/schemes/:id
 * @route   PUT    /api/schemes/:id
 * @route   DELETE /api/schemes/:id
 */
router
  .route('/:id')
  .get(optionalAuth, schemeIdValidator, validate, getSchemeById)
  .put(protect, authorize('admin'), schemeIdValidator, validate, updateScheme)
  .delete(protect, authorize('admin'), schemeIdValidator, validate, deleteScheme);

module.exports = router;
