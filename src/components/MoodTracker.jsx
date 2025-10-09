import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getCurrentDate } from '../utils/dataHelpers';

const moods = [
  { emoji: '😢', label: 'Sad', value: 1, color: 'bg-red-500' },
  { emoji: '😕', label: 'Meh', value: 2, color: 'bg-orange-500' },
  { emoji: '😐', label: 'Okay', value: 3, color: 'bg-yellow-500' },
  { emoji: '😊', label: 'Good', value: 4, color: 'bg-green-500' },
  { emoji: '😄', label: 'Great', value: 5, color: 'bg-blue-500' },
];

export default function MoodTracker({ moodData, setMoodData }) {
  const [note, setNote] = useState('');
  const today = getCurrentDate();
  const todayMood = moodData.find(m => m.date === today);

  const logMood = (moodValue) => {
    const newMood = {
      date: today,
      mood: moodValue,
      note: note,
      timestamp: new Date().toISOString(),
    };

    const existingIndex = moodData.findIndex(m => m.date === today);
    if (existingIndex >= 0) {
      const updated = [...moodData];
      updated[existingIndex] = newMood;
      setMoodData(updated);
    } else {
      setMoodData([...moodData, newMood]);
    }
    setNote('');
  };

  const getAverageMood = () => {
    if (moodData.length === 0) return 0;
    const sum = moodData.reduce((acc, m) => acc + m.mood, 0);
    return (sum / moodData.length).toFixed(1);
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">😊 Mood Tracker</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          How are you feeling today?
        </p>
        <div className="flex justify-between gap-2 mb-4">
          {moods.map((mood) => (
            <motion.button
              key={mood.value}
              onClick={() => logMood(mood.value)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                todayMood?.mood === mood.value
                  ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-3xl mb-1">{mood.emoji}</span>
              <span className="text-xs font-medium">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note about your mood (optional)..."
          rows="3"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      {todayMood && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg mb-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {moods.find(m => m.value === todayMood.mood)?.emoji}
            </span>
            <span className="font-semibold">Today's Mood Logged!</span>
          </div>
          {todayMood.note && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              "{todayMood.note}"
            </p>
          )}
        </motion.div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {getAverageMood()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Average Mood
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {moodData.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Days Tracked
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="font-semibold mb-2">Recent Moods</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {moodData.slice(-7).reverse().map((entry) => (
            <div
              key={entry.date}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {moods.find(m => m.value === entry.mood)?.emoji}
                </span>
                <span className="text-sm">{entry.date}</span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {moods.find(m => m.value === entry.mood)?.label}
              </span>
            </div>
          ))}
          {moodData.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No mood entries yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
