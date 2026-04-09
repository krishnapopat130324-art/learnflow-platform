import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminPanel = () => {
  const [lessons, setLessons] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    difficulty: 'beginner',
    category: '',
    estimatedTime: 5,
    xpReward: 50
  });
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [lessonsRes, analyticsRes] = await Promise.all([
        axios.get(`${apiUrl}/lessons`),
        axios.get(`${apiUrl}/analytics/admin`)
      ]);
      setLessons(lessonsRes.data.data);
      setStats(analyticsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/lessons`, formData);
      toast.success('Lesson created successfully');
      setShowLessonModal(false);
      resetForm();
      fetchAdminData();
    } catch (error) {
      console.error('Failed to create lesson:', error);
      toast.error('Failed to create lesson');
    }
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/lessons/${editingLesson._id}`, formData);
      toast.success('Lesson updated successfully');
      setShowLessonModal(false);
      setEditingLesson(null);
      resetForm();
      fetchAdminData();
    } catch (error) {
      console.error('Failed to update lesson:', error);
      toast.error('Failed to update lesson');
    }
  };

  const handleDeleteLesson = async (id) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await axios.delete(`${apiUrl}/lessons/${id}`);
        toast.success('Lesson deleted successfully');
        fetchAdminData();
      } catch (error) {
        console.error('Failed to delete lesson:', error);
        toast.error('Failed to delete lesson');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      difficulty: 'beginner',
      category: '',
      estimatedTime: 5,
      xpReward: 50
    });
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      difficulty: lesson.difficulty,
      category: lesson.category,
      estimatedTime: lesson.estimatedTime,
      xpReward: lesson.xpReward
    });
    setShowLessonModal(true);
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Manage lessons and monitor platform analytics</p>
          </div>
          <button
            onClick={() => setShowLessonModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create Lesson
          </button>
        </div>

        {/* Admin Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-gray-500 text-sm">Total Users</h3>
              <p className="text-3xl font-bold text-primary-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-gray-500 text-sm">Total Lessons</h3>
              <p className="text-3xl font-bold text-primary-600">{stats.totalLessons}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-gray-500 text-sm">Avg Completion Rate</h3>
              <p className="text-3xl font-bold text-primary-600">
                {Math.round(stats.averageCompletionRate)}%
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-gray-500 text-sm">Total Quiz Attempts</h3>
              <p className="text-3xl font-bold text-primary-600">{stats.totalQuizAttempts}</p>
            </div>
          </div>
        )}

        {/* Lessons Management Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Manage Lessons</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{lesson.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {lesson.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lesson.estimatedTime} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(lesson)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
              </h2>
              <form onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      rows="2"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      required
                      rows="6"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="input-field"
                        placeholder="e.g., JavaScript, Python"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                        className="input-field"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Est. Time (minutes)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="60"
                        value={formData.estimatedTime}
                        onChange={(e) => setFormData({...formData, estimatedTime: parseInt(e.target.value)})}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">XP Reward</label>
                      <input
                        type="number"
                        required
                        min="10"
                        max="200"
                        value={formData.xpReward}
                        onChange={(e) => setFormData({...formData, xpReward: parseInt(e.target.value)})}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="submit" className="btn-primary flex-1">
                    {editingLesson ? 'Update' : 'Create'} Lesson
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLessonModal(false);
                      setEditingLesson(null);
                      resetForm();
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminPanel;