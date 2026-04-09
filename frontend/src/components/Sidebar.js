import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  BookOpenIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ sidebarOpen }) => {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Lessons', href: '/lessons', icon: BookOpenIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon },
  ];

  if (user?.role === 'admin') {
    navigation.push({ name: 'Admin Panel', href: '/admin', icon: ShieldCheckIcon });
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform duration-300 bg-white border-r border-gray-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                    isActive ? 'bg-primary-50 text-primary-600' : ''
                  }`
                }
              >
                <item.icon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* User Stats Mini */}
        <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-indigo-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Level {user?.level}</span>
            <span className="text-sm font-medium text-primary-600">{user?.xp} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((user?.xp % 200) / 200) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {200 - (user?.xp % 200)} XP to next level
          </p>
          {user?.streak > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-orange-500">🔥</span>
              <span className="text-gray-600">{user?.streak} day streak!</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;