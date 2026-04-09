const express = require('express');
const { 
  getUserAnalytics, 
  getAdminAnalytics 
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/user
// @desc    Get analytics for logged-in user
// @access  Private
router.get('/user', protect, getUserAnalytics);

// @route   GET /api/analytics/admin
// @desc    Get admin analytics (all users data)
// @access  Private/Admin
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);

module.exports = router;