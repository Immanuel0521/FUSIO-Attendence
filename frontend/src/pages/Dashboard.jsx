import React, { useState, useEffect } from 'react';
import { workerService, attendanceService } from '../services/api';
import { Users, Calendar, Clock, AlertCircle, TrendingUp } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    presentToday: 0,
    overtimeToday: 0,
    lateToday: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [workersResponse, attendanceResponse] = await Promise.all([
        workerService.getAll(),
        attendanceService.getRecords({ date: today })
      ]);

      const totalWorkers = workersResponse.data.length;
      const presentToday = attendanceResponse.data.length;
      
      let overtimeToday = 0;
      let lateToday = 0;

      attendanceResponse.data.forEach(record => {
        if (record.overtime_hours > 0) overtimeToday++;
        if (record.actual_start > '09:00') lateToday++;
      });

      setStats({
        totalWorkers,
        presentToday,
        overtimeToday,
        lateToday
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Workers"
          value={stats.totalWorkers}
          color="text-blue-600"
        />
        <StatCard
          icon={Calendar}
          title="Present Today"
          value={stats.presentToday}
          color="text-green-600"
        />
        <StatCard
          icon={Clock}
          title="Overtime Today"
          value={stats.overtimeToday}
          color="text-orange-600"
        />
        <StatCard
          icon={AlertCircle}
          title="Late Today"
          value={stats.lateToday}
          color="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/attendance'}
              className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              📝 Mark Today's Attendance
            </button>
            <button 
              onClick={() => window.location.href = '/workers'}
              className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              👥 Add New Worker
            </button>
            <button 
              onClick={() => window.location.href = '/reports'}
              className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              📊 Generate Reports
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">System Info</h2>
          <div className="space-y-2 text-gray-600">
            <p>✅ Supervisor Login System</p>
            <p>✅ Worker Database Management</p>
            <p>✅ Daily Attendance Tracking</p>
            <p>✅ Overtime Calculation</p>
            <p>✅ CSV/Excel Export</p>
            <p>✅ Backup & Restore</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
