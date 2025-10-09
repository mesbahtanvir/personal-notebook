import React from 'react';
import { motion } from 'framer-motion';
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
  Cell,
} from 'recharts';
import { calculateProductivityScore } from '../utils/dataHelpers';

export default function DashboardInsights({ tasks, moodData, focusBlocks }) {
  // Calculate statistics
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const averageMood = moodData.length > 0
    ? moodData.reduce((acc, m) => acc + m.mood, 0) / moodData.length
    : 0;

  const productivityScore = calculateProductivityScore(completedTasks, averageMood);

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const taskChartData = last7Days.map(date => {
    const dayTasks = tasks.filter(t => t.date === date);
    const completed = dayTasks.filter(t => t.status === 'completed').length;
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      completed,
      total: dayTasks.length,
    };
  });

  const moodChartData = last7Days.map(date => {
    const dayMood = moodData.find(m => m.date === date);
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      mood: dayMood ? dayMood.mood : null,
    };
  });

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' },
  ].filter(d => d.value > 0);

  const stats = [
    {
      label: 'Productivity Score',
      value: productivityScore,
      icon: '📊',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Tasks Completed',
      value: completedTasks,
      icon: '✅',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Focus Blocks',
      value: focusBlocks.length,
      icon: '⏱️',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: '🎯',
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-bold mb-4">📈 Task Completion (7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                }}
              />
              <Legend />
              <Bar dataKey="completed" fill="#0ea5e9" name="Completed" />
              <Bar dataKey="total" fill="#94a3b8" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Mood Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-bold mb-4">😊 Mood Trend (7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={moodChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis domain={[0, 5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                name="Mood"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Priority Distribution */}
      {priorityData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-bold mb-4">🎯 Task Priority Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
