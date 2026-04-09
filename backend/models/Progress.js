const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  quizScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  attempts: {
    type: Number,
    default: 0
  },
  bestScore: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0 // in seconds
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to ensure one progress record per user per lesson
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

// Virtual for isPassed
progressSchema.virtual('isPassed').get(function() {
  return this.quizScore >= 70;
});

// Update best score on save
progressSchema.pre('save', function(next) {
  if (this.quizScore > this.bestScore) {
    this.bestScore = this.quizScore;
  }
  next();
});

module.exports = mongoose.model('Progress', progressSchema);