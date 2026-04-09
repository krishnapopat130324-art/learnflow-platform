const Progress = require('../models/Progress');
const User = require('../models/User');
const Lesson = require('../models/Lesson');

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id })
      .populate('lessonId', 'title category difficulty estimatedTime xpReward');
    
    const totalLessons = await Lesson.countDocuments({ isPublished: true });
    const completedLessons = progress.filter(p => p.completed).length;
    const averageScore = progress.reduce((sum, p) => sum + p.quizScore, 0) / (progress.length || 1);
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);
    
    const user = await User.findById(req.user.id);
    
    // Calculate category-wise progress
    const categoryProgress = {};
    for (const p of progress) {
      if (p.lessonId && p.lessonId.category) {
        if (!categoryProgress[p.lessonId.category]) {
          categoryProgress[p.lessonId.category] = {
            total: 0,
            completed: 0,
            totalScore: 0
          };
        }
        categoryProgress[p.lessonId.category].total++;
        categoryProgress[p.lessonId.category].totalScore += p.quizScore;
        if (p.completed) {
          categoryProgress[p.lessonId.category].completed++;
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        progress,
        stats: {
          totalLessons,
          completedLessons,
          completionRate: (completedLessons / totalLessons) * 100,
          averageScore,
          totalXP: user.xp,
          level: user.level,
          streak: user.streak,
          badges: user.badges,
          totalTimeSpent,
          nextLevelXP: user.nextLevelXP,
          xpProgress: user.xpProgress
        },
        categoryProgress
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get weak areas
// @route   GET /api/progress/weak-areas
// @access  Private
const getWeakAreas = async (req, res) => {
  try {
    const weakProgress = await Progress.find({
      userId: req.user.id,
      quizScore: { $lt: 70 },
      completed: true
    }).populate('lessonId', 'title category difficulty');
    
    const weakCategories = {};
    weakProgress.forEach(p => {
      if (p.lessonId) {
        if (!weakCategories[p.lessonId.category]) {
          weakCategories[p.lessonId.category] = {
            count: 0,
            averageScore: 0,
            lessons: []
          };
        }
        weakCategories[p.lessonId.category].count++;
        weakCategories[p.lessonId.category].averageScore += p.quizScore;
        weakCategories[p.lessonId.category].lessons.push({
          id: p.lessonId._id,
          title: p.lessonId.title,
          score: p.quizScore
        });
      }
    });
    
    // Calculate averages
    Object.keys(weakCategories).forEach(category => {
      weakCategories[category].averageScore /= weakCategories[category].count;
    });
    
    res.json({
      success: true,
      data: {
        weakLessons: weakProgress,
        weakCategories
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/progress/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find()
      .select('name xp level badges streak')
      .sort('-xp')
      .limit(10);
    
    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getProgress,
  getWeakAreas,
  getLeaderboard
};