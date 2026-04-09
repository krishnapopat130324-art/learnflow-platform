const Progress = require('../models/Progress');
const User = require('../models/User');
const Lesson = require('../models/Lesson');

// @desc    Get user analytics
// @route   GET /api/analytics/user
// @access  Private
const getUserAnalytics = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id })
      .populate('lessonId', 'title category difficulty');
    
    const user = await User.findById(req.user.id);
    const lessons = await Lesson.find();
    
    // Weekly performance (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayProgress = progress.filter(p => {
        const attemptDate = new Date(p.lastAttemptAt);
        return attemptDate >= date && attemptDate < nextDate;
      });
      
      const dayLessons = dayProgress.filter(p => p.completed).length;
      const dayAvgScore = dayProgress.length > 0 
        ? dayProgress.reduce((sum, p) => sum + p.quizScore, 0) / dayProgress.length 
        : 0;
      
      weeklyData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        lessonsCompleted: dayLessons,
        averageScore: Math.round(dayAvgScore),
        attempts: dayProgress.length
      });
    }
    
    // Category performance
    const categoryPerformance = {};
    for (const p of progress) {
      if (p.lessonId && p.lessonId.category) {
        if (!categoryPerformance[p.lessonId.category]) {
          categoryPerformance[p.lessonId.category] = {
            totalScore: 0,
            count: 0,
            completed: 0
          };
        }
        categoryPerformance[p.lessonId.category].totalScore += p.quizScore;
        categoryPerformance[p.lessonId.category].count++;
        if (p.completed) {
          categoryPerformance[p.lessonId.category].completed++;
        }
      }
    }
    
    // Calculate average scores for categories
    const categoryAverages = Object.entries(categoryPerformance).map(([name, data]) => ({
      name,
      averageScore: data.totalScore / data.count,
      completedLessons: data.completed,
      totalLessons: data.count
    }));
    
    // Identify strong and weak areas
    const strongAreas = categoryAverages.filter(c => c.averageScore >= 70).map(c => c.name);
    const weakAreas = categoryAverages.filter(c => c.averageScore < 70).map(c => c.name);
    
    // Calculate total time spent
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);
    
    // Calculate completion rate
    const completionRate = lessons.length > 0 
      ? (progress.filter(p => p.completed).length / lessons.length) * 100 
      : 0;
    
    res.json({
      success: true,
      data: {
        weeklyPerformance: weeklyData,
        categoryPerformance: categoryAverages,
        strongAreas,
        weakAreas,
        totalTimeSpent,
        completionRate: Math.round(completionRate),
        totalLessonsCompleted: progress.filter(p => p.completed).length,
        totalLessons: lessons.length,
        averageQuizScore: progress.length > 0 
          ? progress.reduce((sum, p) => sum + p.quizScore, 0) / progress.length 
          : 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get admin analytics (all users)
// @route   GET /api/analytics/admin
// @access  Private/Admin
const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLessons = await Lesson.countDocuments({ isPublished: true });
    const allProgress = await Progress.find().populate('userId', 'name email');
    
    const totalCompletedLessons = allProgress.filter(p => p.completed).length;
    const averageCompletionRate = (totalCompletedLessons / (totalUsers * totalLessons)) * 100;
    const averageScore = allProgress.reduce((sum, p) => sum + p.quizScore, 0) / (allProgress.length || 1);
    
    // Top performing users
    const topUsers = await User.find()
      .select('name xp level streak')
      .sort('-xp')
      .limit(5);
    
    // Most popular lessons
    const lessonStats = {};
    for (const p of allProgress) {
      const lessonId = p.lessonId.toString();
      if (!lessonStats[lessonId]) {
        lessonStats[lessonId] = {
          attempts: 0,
          completions: 0
        };
      }
      lessonStats[lessonId].attempts++;
      if (p.completed) {
        lessonStats[lessonId].completions++;
      }
    }
    
    const popularLessons = await Promise.all(
      Object.entries(lessonStats)
        .sort((a, b) => b[1].attempts - a[1].attempts)
        .slice(0, 5)
        .map(async ([id, stats]) => {
          const lesson = await Lesson.findById(id);
          return {
            title: lesson?.title || 'Unknown',
            attempts: stats.attempts,
            completions: stats.completions
          };
        })
    );
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalLessons,
        totalQuizAttempts: allProgress.length,
        totalCompletedLessons,
        averageCompletionRate: Math.round(averageCompletionRate),
        averageScore: Math.round(averageScore),
        topUsers,
        popularLessons
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getUserAnalytics,
  getAdminAnalytics
};