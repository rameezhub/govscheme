const express = require('express');
const router = express.Router();

const {
  getProfile, updateProfile, saveScheme,
  removeSavedScheme, getAllUsers, deactivateAccount
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfileValidator } = require('../utils/validators');
const { param } = require('express-validator');

// All routes require authentication
router.use(protect);

/**
 * @route   GET  /api/user/profile
 * @route   PUT  /api/user/profile
 * @route   DELETE /api/user/profile
 */
router
  .route('/profile')
  .get(getProfile)
  .put(updateProfileValidator, validate, updateProfile)
  .delete(deactivateAccount);

/**
 * @route   GET /api/user/all
 * @desc    Admin: list all users
 */
router.get('/all', authorize('admin'), getAllUsers);

/**
 * @route   POST   /api/user/saved-schemes/:schemeId
 * @route   DELETE /api/user/saved-schemes/:schemeId
 */
router
  .route('/saved-schemes/:schemeId')
  .post(
    [param('schemeId').isMongoId().withMessage('Invalid scheme ID')],
    validate,
    saveScheme
  )
  .delete(
    [param('schemeId').isMongoId().withMessage('Invalid scheme ID')],
    validate,
    removeSavedScheme
  );

module.exports = router;
