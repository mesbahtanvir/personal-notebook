import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateId } from '../utils/dataHelpers';

export default function Backlog({ tasks, setTasks }) {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const task = {
        id: generateId(),
        title: newTask,
        priority,
        status: 'backlog',
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setPriority('medium');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const moveToToday = (task) => {
    setTasks(tasks.map(t => 
      t.id === task.id 
        ? { ...t, status: 'today', date: new Date().toISOString().split('T')[0] }
        : t
    ));
  };

  const backlogTasks = tasks.filter(task => task.status === 'backlog');

  const priorityColors = {
    high: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
    low: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">📋 Backlog</h2>
      
      <form onSubmit={addTask} className="mb-6">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button type="submit" className="btn-primary w-full">
          Add Task
        </button>
      </form>

      <div className="space-y-2">
        <AnimatePresence>
          {backlogTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`p-4 rounded-lg border-2 ${priorityColors[task.priority]}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Priority: {task.priority}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveToToday(task)}
                    className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors"
                  >
                    → Today
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {backlogTasks.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No tasks in backlog. Add some tasks to get started!
          </p>
        )}
      </div>
    </div>
  );
}
