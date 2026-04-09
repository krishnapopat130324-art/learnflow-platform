const express = require('express');
const {
  getProgress,
  getWeakAreas,
  getLeaderboard
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.get('/', protect, getProgress);
router.get('/weak-areas', protect, getWeakAreas);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;