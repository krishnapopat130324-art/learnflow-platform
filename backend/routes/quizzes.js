const express = require('express');
const {
  getQuizByLesson,
  submitQuiz,
  createQuiz,
  updateQuiz
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// User routes
router.get('/lesson/:lessonId', protect, getQuizByLesson);
router.post('/submit', protect, submitQuiz);

// Admin only routes
router.post('/', protect, authorize('admin'), createQuiz);
router.put('/:id', protect, authorize('admin'), updateQuiz);

module.exports = router;