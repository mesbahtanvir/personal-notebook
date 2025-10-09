import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FocusBlocks({ focusBlocks, setFocusBlocks }) {
  const [duration, setDuration] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [currentTask, setCurrentTask] = useState('');

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer completed
      setIsActive(false);
      const newBlock = {
        id: Date.now(),
        duration,
        task: currentTask,
        completedAt: new Date().toISOString(),
      };
      setFocusBlocks([...focusBlocks, newBlock]);
      setTimeLeft(duration * 60);
      // Play a notification sound or show alert
      alert('Focus block completed! Great work! 🎉');
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, duration, currentTask, focusBlocks, setFocusBlocks]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">⏱️ Focus Blocks</h2>
      
      <div className="mb-6">
        <input
          type="text"
          value={currentTask}
          onChange={(e) => setCurrentTask(e.target.value)}
          placeholder="What are you working on?"
          disabled={isActive}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
        />

        <div className="flex items-center justify-center mb-4">
          <motion.div
            className="relative w-48 h-48"
            animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
          >
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-primary-600"
                initial={{ strokeDasharray: "552.92", strokeDashoffset: "552.92" }}
                animate={{ strokeDashoffset: 552.92 - (552.92 * progress) / 100 }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </motion.div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setDuration(25)}
            disabled={isActive}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              duration === 25
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            25 min
          </button>
          <button
            onClick={() => setDuration(45)}
            disabled={isActive}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              duration === 45
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            45 min
          </button>
          <button
            onClick={() => setDuration(60)}
            disabled={isActive}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              duration === 60
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            60 min
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            className="flex-1 btn-primary"
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="flex-1 btn-secondary"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="font-semibold mb-2">Completed Today: {focusBlocks.length}</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {focusBlocks.slice(-5).reverse().map((block) => (
            <div
              key={block.id}
              className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
            >
              <div className="font-medium">{block.task || 'Untitled'}</div>
              <div className="text-gray-600 dark:text-gray-400">
                {block.duration} minutes
              </div>
            </div>
          ))}
          {focusBlocks.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No focus blocks completed yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
