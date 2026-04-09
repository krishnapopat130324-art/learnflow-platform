import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${apiUrl}/analytics/user`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (!analytics) return null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Analytics</h1>
          <p className="text-gray-600">Track your progress and performance</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-500 text-sm mb-2">Completion Rate</h3>
            <p className="text-3xl font-bold text-primary-600">
              {Math.round(analytics.completionRate)}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-500 text-sm mb-2">Total Time Spent</h3>
            <p className="text-3xl font-bold text-primary-600">
              {Math.round(analytics.totalTimeSpent / 60)} mins
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-500 text-sm mb-2">Strong Areas</h3>
            <p className="text-3xl font-bold text-primary-600">
              {analytics.strongAreas?.length || 0}
            </p>
          </div>
        </div>

        {/* Weekly Performance Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.weeklyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="lessonsCompleted"
                stroke="#3b82f6"
                name="Lessons Completed"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="averageScore"
                stroke="#10b981"
                name="Average Score (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Category Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageScore" fill="#3b82f6" name="Average Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Areas of Strength & Weakness</h2>
            <div className="space-y-4">
              {analytics.strongAreas && analytics.strongAreas.length > 0 && (
                <div>
                  <h3 className="font-semibold text-green-600 mb-2">💪 Strong Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics.strongAreas.map((area, index) => (
                      <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analytics.weakAreas && analytics.weakAreas.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">📚 Needs Improvement</h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics.weakAreas.map((area, index) => (
                      <span key={index} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {analytics.weakAreas && analytics.weakAreas.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-blue-800 mb-3">🎯 Recommendations</h2>
            <p className="text-blue-700">
              Focus on improving in {analytics.weakAreas.join(', ')} to level up faster!
              We recommend revisiting lessons in these categories.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;