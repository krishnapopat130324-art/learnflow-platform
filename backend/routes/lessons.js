const express = require('express');
const {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes (but require authentication)
router.get('/', protect, getLessons);
router.get('/:id', protect, getLesson);

// Admin only routes
router.post('/', protect, authorize('admin'), createLesson);
router.put('/:id', protect, authorize('admin'), updateLesson);
router.delete('/:id', protect, authorize('admin'), deleteLesson);

module.exports = router;