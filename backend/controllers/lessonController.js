const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');

// @desc    Get all lessons with adaptive recommendations
// @route   GET /api/lessons
// @access  Private
const getLessons = async (req, res) => {
  try {
    // Get user progress
    const userProgress = await Progress.find({ userId: req.user.id });
    const completedLessons = userProgress.filter(p => p.completed).map(p => p.lessonId.toString());
    const weakLessons = userProgress.filter(p => p.quizScore < 70 && p.completed).map(p => p.lessonId.toString());
    
    // Build adaptive query
    let query = { isPublished: true };
    
    if (weakLessons.length > 0) {
      // User has weak areas - suggest easier content
      const weakLessonDetails = await Lesson.find({ _id: { $in: weakLessons } });
      const weakCategories = weakLessonDetails.map(l => l.category);
      query = {
        ...query,
        category: { $in: weakCategories },
        difficulty: 'beginner'
      };
    } else if (completedLessons.length > 5) {
      // User is doing well - unlock advanced content
      query = {
        ...query,
        difficulty: { $in: ['intermediate', 'advanced'] }
      };
    }
    
    const lessons = await Lesson.find(query).sort('order').populate('prerequisiteLessons', 'title');
    
    // Enhance lessons with progress data
    const enhancedLessons = lessons.map(lesson => ({
      ...lesson.toObject(),
      completed: completedLessons.includes(lesson._id.toString()),
      isRecommended: weakLessons.includes(lesson._id.toString()),
      progress: userProgress.find(p => p.lessonId.toString() === lesson._id.toString())
    }));
    
    res.json({
      success: true,
      count: enhancedLessons.length,
      data: enhancedLessons
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

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Private
const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('prerequisiteLessons', 'title description');
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    // Check if user has completed prerequisites
    const userProgress = await Progress.find({ 
      userId: req.user.id,
      lessonId: { $in: lesson.prerequisiteLessons }
    });
    
    const prerequisitesCompleted = lesson.prerequisiteLessons.every(prereq => 
      userProgress.some(p => p.lessonId.toString() === prereq._id.toString() && p.completed)
    );
    
    res.json({
      success: true,
      data: {
        ...lesson.toObject(),
        prerequisitesCompleted
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

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private/Admin
const createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    res.status(201).json({
      success: true,
      data: lesson
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

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Admin
const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Admin
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    // Delete associated progress records
    await Progress.deleteMany({ lessonId: req.params.id });
    
    res.json({
      success: true,
      message: 'Lesson deleted successfully'
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
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson
};