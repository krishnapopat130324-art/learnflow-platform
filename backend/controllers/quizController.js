const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const User = require('../models/User');
const Lesson = require('../models/Lesson');

// @desc    Get quiz by lesson ID
// @route   GET /api/quizzes/lesson/:lessonId
// @access  Private
const getQuizByLesson = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lessonId: req.params.lessonId });
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found for this lesson'
      });
    }
    
    // Remove correct answers for security
    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      totalPoints: quiz.totalPoints,
      questions: quiz.questions.map(q => ({
        questionText: q.questionText,
        options: q.options,
        points: q.points,
        explanation: q.explanation
      }))
    };
    
    res.json({
      success: true,
      data: safeQuiz
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { lessonId, answers, timeSpent } = req.body;
    
    // Get quiz
    const quiz = await Quiz.findOne({ lessonId });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    // Calculate score
    let correctCount = 0;
    let earnedPoints = 0;
    
    answers.forEach((answer, index) => {
      const isCorrect = answer === quiz.questions[index].correctAnswer;
      if (isCorrect) {
        correctCount++;
        earnedPoints += quiz.questions[index].points;
      }
    });
    
    const score = (correctCount / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;
    
    // Update or create progress
    let progress = await Progress.findOne({
      userId: req.user.id,
      lessonId
    });
    
    if (!progress) {
      progress = new Progress({
        userId: req.user.id,
        lessonId
      });
    }
    
    progress.quizScore = score;
    progress.attempts += 1;
    progress.timeSpent += timeSpent;
    progress.lastAttemptAt = new Date();
    
    if (passed && !progress.completed) {
      progress.completed = true;
      progress.completedAt = new Date();
      
      // Get lesson for XP reward
      const lesson = await Lesson.findById(lessonId);
      const xpEarned = lesson.xpReward;
      
      // Update user
      const user = await User.findById(req.user.id);
      user.xp += xpEarned;
      
      // Level up logic
      const newLevel = Math.floor(user.xp / 200) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
      }
      
      // Award badges
      if (!user.badges.includes('Fast Learner') && user.xp >= 200) {
        user.badges.push('Fast Learner');
      }
      
      if (score === 100 && !user.badges.includes('Quiz Master')) {
        user.badges.push('Quiz Master');
      }
      
      if (user.streak >= 7 && !user.badges.includes('Consistency Champion')) {
        user.badges.push('Consistency Champion');
      }
      
      if (user.xp >= 1000 && !user.badges.includes('Expert')) {
        user.badges.push('Expert');
      }
      
      await user.save();
      
      await progress.save();
      
      return res.json({
        success: true,
        score,
        passed,
        correctCount,
        totalQuestions: quiz.questions.length,
        earnedPoints,
        earnedXP: xpEarned,
        message: `🎉 Congratulations! You passed the quiz and earned ${xpEarned} XP!`
      });
    }
    
    await progress.save();
    
    res.json({
      success: true,
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      earnedPoints,
      earnedXP: 0,
      message: passed ? 'Quiz passed!' : 'Keep practicing! Try again to earn XP.'
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

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private/Admin
const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({
      success: true,
      data: quiz
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

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    res.json({
      success: true,
      data: quiz
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
  getQuizByLesson,
  submitQuiz,
  createQuiz,
  updateQuiz
};