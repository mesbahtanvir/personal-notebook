import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentDate } from '../utils/dataHelpers';

export default function TodayTasks({ tasks, setTasks }) {
  const today = getCurrentDate();
  const todayTasks = tasks.filter(task => task.date === today && task.status === 'today');

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'today' : 'completed' }
        : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = todayTasks.filter(t => t.status === 'completed').length;
  const totalCount = todayTasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">✅ Today's Tasks</h2>
        <div className="text-sm font-semibold">
          <span className="text-primary-600 dark:text-primary-400">
            {completedCount}/{totalCount}
          </span>
          <span className="text-gray-500 ml-2">({completionPercentage}%)</span>
        </div>
      </div>

      {totalCount > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {todayTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-4 rounded-lg border-2 transition-all ${
                task.status === 'completed'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => toggleComplete(task.id)}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    task.status === 'completed' ? 'line-through text-gray-500' : ''
                  }`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Priority: {task.priority}
                  </p>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {todayTasks.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No tasks for today. Move tasks from your backlog!
          </p>
        )}
      </div>
    </div>
  );
}
