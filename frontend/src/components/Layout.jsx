import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  LogOut,
  Menu,
  Factory
} from 'lucide-react';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Workers', href: '/workers', icon: Users },
    { name: 'Attendance', href: '/attendance', icon: Calendar },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-blue-800 transition duration-300 transform lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center h-16 bg-blue-900">
          <Factory className="h-8 w-8 text-white" />
          <span className="ml-2 text-white text-xl font-semibold">Attendance System</span>
        </div>
        
        <nav className="mt-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-3 text-white ${
                  location.pathname === item.href
                    ? 'bg-blue-900 border-r-4 border-white'
                    : 'hover:bg-blue-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span className="mx-3">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="bg-white shadow">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                className="text-gray-500 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-4 text-2xl font-semibold text-gray-800">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default Layout;
