import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import { 
  TrophyIcon, 
  FireIcon, 
  StarIcon, 
  ChartBarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentLessons, setRecentLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [progressRes, lessonsRes] = await Promise.all([
        axios.get(`${apiUrl}/progress`),
        axios.get(`${apiUrl}/lessons`)
      ]);
      setStats(progressRes.data.data.stats);
      setRecentLessons(lessonsRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Layout><div className="flex justify-center items-center h-64">Loading...</div></Layout>;
  }

  const statsCards = [
    {
      title: 'Total XP',
      value: stats?.totalXP || 0,
      icon: TrophyIcon,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Level',
      value: stats?.level || 1,
      icon: StarIcon,
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    },
    {
      title: 'Streak',
      value: `${stats?.streak || 0} days`,
      icon: FireIcon,
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    {
      title: 'Completion',
      value: `${Math.round(stats?.completionRate || 0)}%`,
      icon: ChartBarIcon,
      color: 'text-green-500',
      bg: 'bg-green-50'
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-primary-100">
            Continue your learning journey and earn rewards
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">{stat.title}</h3>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* XP Progress */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Level Progress</h3>
            <span className="text-sm text-gray-600">
              {stats?.totalXP} / {stats?.nextLevelXP} XP
            </span>
          </div>
          <ProgressBar value={stats?.totalXP} max={stats?.nextLevelXP} />
        </div>

        {/* Badges */}
        {stats?.badges && stats.badges.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <AcademicCapIcon className="h-6 w-6 text-primary-600 mr-2" />
              Your Achievements
            </h2>
            <div className="flex flex-wrap gap-3">
              {stats.badges.map((badge, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2"
                >
                  🏆 {badge}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Lessons */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BookOpenIcon className="h-6 w-6 text-primary-600 mr-2" />
            Recommended for You
          </h2>
          <div className="space-y-4">
            {recentLessons.map((lesson) => (
              <div
                key={lesson._id}
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:border-primary-300"
                onClick={() => navigate(`/lessons/${lesson._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {lesson.estimatedTime} min
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {lesson.difficulty}
                      </span>
                      {lesson.isRecommended && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                          ⭐ Recommended
                        </span>
                      )}
                      {lesson.completed && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          ✅ Completed
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="btn-primary text-sm py-1 px-3">
                    Start Lesson →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;