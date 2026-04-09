import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Quiz = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchQuiz();
  }, [lessonId]);

  useEffect(() => {
    if (quiz && timeLeft === null) {
      setTimeLeft(quiz.timeLimit);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`${apiUrl}/quizzes/lesson/${lessonId}`);
      setQuiz(response.data.data);
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      toast.error('Quiz not found');
      navigate(`/lessons/${lessonId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    const formattedAnswers = quiz.questions.map((_, index) => answers[index]);
    const timeSpent = quiz.timeLimit - timeLeft;

    try {
      const response = await axios.post(`${apiUrl}/quizzes/submit`, {
        lessonId,
        answers: formattedAnswers,
        timeSpent
      });
      setResult(response.data);
      setSubmitted(true);
      
      if (response.data.passed) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      toast.error('Failed to submit quiz');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (!quiz) return null;

  if (submitted && result) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className={`text-6xl mb-4 ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
              {result.passed ? '🎉' : '📚'}
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            <p className="text-gray-600 mb-4">{result.message}</p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Your Score</p>
                  <p className="text-3xl font-bold text-primary-600">{Math.round(result.score)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Correct Answers</p>
                  <p className="text-3xl font-bold text-green-600">
                    {result.correctCount}/{result.totalQuestions}
                  </p>
                </div>
                {result.earnedXP > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">XP Earned</p>
                    <p className="text-2xl font-bold text-yellow-500">+{result.earnedXP} XP</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(`/lessons/${lessonId}`)}
                className="btn-secondary"
              >
                Back to Lesson
              </button>
              <button
                onClick={() => navigate('/lessons')}
                className="btn-primary"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-primary-600 text-white p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              <div className="flex items-center gap-2 bg-primary-700 px-4 py-2 rounded-lg">
                <ClockIcon className="h-5 w-5" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <p className="text-primary-100 mt-2">{quiz.description}</p>
          </div>

          <div className="p-6">
            <div className="space-y-8">
              {quiz.questions.map((question, qIndex) => (
                <div key={qIndex} className="border-b pb-6 last:border-b-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {qIndex + 1}. {question.questionText}
                    <span className="text-sm text-gray-500 ml-2">({question.points} pts)</span>
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                          answers[qIndex] === oIndex
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          value={oIndex}
                          checked={answers[qIndex] === oIndex}
                          onChange={() => handleAnswerSelect(qIndex, oIndex)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={handleSubmit}
                className="btn-primary w-full py-3 text-lg"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Quiz;