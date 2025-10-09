import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [moodData, setMoodData] = useLocalStorage('moodData', []);
  const [focusBlocks, setFocusBlocks] = useLocalStorage('focusBlocks', []);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Theme Toggle Button */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </motion.button>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Dashboard
          tasks={tasks}
          setTasks={setTasks}
          moodData={moodData}
          setMoodData={setMoodData}
          focusBlocks={focusBlocks}
          setFocusBlocks={setFocusBlocks}
        />
      </div>
    </div>
  );
}

export default App;
