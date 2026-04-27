const express = require('express');
const router = express.Router();

const {
  getAnalytics,
  getUserById,
  toggleUserStatus,
  bulkToggleSchemes,
  getAllSchemesAdmin
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { body, param } = require('express-validator');

// All admin routes: must be authenticated AND have role=admin
router.use(protect, authorize('admin'));

/**
 * @route   GET /api/admin/analytics
 * @desc    Platform-wide analytics dashboard
 */
router.get('/analytics', getAnalytics);

/**
 * @route   GET /api/admin/users/:userId
 * @desc    Get full profile of any user
 */
router.get(
  '/users/:userId',
  [param('userId').isMongoId().withMessage('Invalid user ID')],
  validate,
  getUserById
);

/**
 * @route   PATCH /api/admin/users/:userId/toggle-status
 * @desc    Ban or unban a user
 */
router.patch(
  '/users/:userId/toggle-status',
  [param('userId').isMongoId().withMessage('Invalid user ID')],
  validate,
  toggleUserStatus
);

/**
 * @route   GET /api/admin/schemes
 * @desc    List ALL schemes (including inactive)
 */
router.get('/schemes', getAllSchemesAdmin);

/**
 * @route   PATCH /api/admin/schemes/bulk-status
 * @desc    Activate or deactivate multiple schemes at once
 */
router.patch(
  '/schemes/bulk-status',
  [
    body('schemeIds').isArray({ min: 1 }).withMessage('schemeIds must be a non-empty array'),
    body('isActive').isBoolean().withMessage('isActive must be true or false')
  ],
  validate,
  bulkToggleSchemes
);

module.exports = router;
