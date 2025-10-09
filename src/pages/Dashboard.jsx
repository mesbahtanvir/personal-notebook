import React from 'react';
import { motion } from 'framer-motion';
import Backlog from '../components/Backlog';
import TodayTasks from '../components/TodayTasks';
import FocusBlocks from '../components/FocusBlocks';
import MoodTracker from '../components/MoodTracker';
import DashboardInsights from '../components/DashboardInsights';

export default function Dashboard({ 
  tasks, 
  setTasks, 
  moodData, 
  setMoodData, 
  focusBlocks, 
  setFocusBlocks 
}) {
  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">📓 Personal Notebook</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your tasks, focus, and mood in one place
        </p>
      </motion.div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <DashboardInsights
          tasks={tasks}
          moodData={moodData}
          focusBlocks={focusBlocks}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TodayTasks tasks={tasks} setTasks={setTasks} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Backlog tasks={tasks} setTasks={setTasks} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FocusBlocks focusBlocks={focusBlocks} setFocusBlocks={setFocusBlocks} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MoodTracker moodData={moodData} setMoodData={setMoodData} />
        </motion.div>
      </div>
    </div>
  );
}
