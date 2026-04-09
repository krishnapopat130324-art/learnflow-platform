import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      const response = await axios.get(`${apiUrl}/lessons/${id}`);
      setLesson(response.data.data);
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
      toast.error('Lesson not found');
      navigate('/lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    navigate(`/quiz/${id}`);
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (!lesson) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/lessons')}
          className="text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center gap-2"
        >
          ← Back to Lessons
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {lesson.difficulty}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-3">{lesson.title}</h1>
              </div>
              {lesson.completed && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  ✅ Completed
                </span>
              )}
            </div>

            <p className="text-gray-600 text-lg mb-6">{lesson.description}</p>

            <div className="flex items-center gap-6 mb-8 text-sm text-gray-500 border-t border-b py-4">
              <span>⏱️ Estimated time: {lesson.estimatedTime} minutes</span>
              <span>🏆 XP Reward: {lesson.xpReward || 50} XP</span>
              <span>📚 Category: {lesson.category}</span>
            </div>

            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Lesson Content</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {lesson.content}
              </div>
            </div>

            {lesson.prerequisiteLessons && lesson.prerequisiteLessons.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-yellow-800 mb-2">Prerequisites</h3>
                <p className="text-sm text-yellow-700">
                  Complete these lessons first:
                  {lesson.prerequisiteLessons.map(prereq => prereq.title).join(', ')}
                </p>
              </div>
            )}

            <button
              onClick={handleStartQuiz}
              className="btn-primary w-full py-3 text-lg"
            >
              Take Quiz →
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LessonDetail;