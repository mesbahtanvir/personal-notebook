/**
 * Utility functions for data manipulation and formatting
 */

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get the current date in YYYY-MM-DD format
 * @returns {string} - Current date string
 */
export function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Calculate completion percentage
 * @param {number} completed - Number of completed items
 * @param {number} total - Total number of items
 * @returns {number} - Percentage (0-100)
 */
export function calculatePercentage(completed, total) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Group tasks by status
 * @param {Array} tasks - Array of task objects
 * @returns {Object} - Object with tasks grouped by status
 */
export function groupTasksByStatus(tasks) {
  return tasks.reduce((acc, task) => {
    const status = task.status || 'backlog';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {});
}

/**
 * Filter tasks by date
 * @param {Array} tasks - Array of task objects
 * @param {string} date - Date string to filter by
 * @returns {Array} - Filtered tasks
 */
export function filterTasksByDate(tasks, date) {
  return tasks.filter(task => task.date === date);
}

/**
 * Sort tasks by priority
 * @param {Array} tasks - Array of task objects
 * @returns {Array} - Sorted tasks
 */
export function sortTasksByPriority(tasks) {
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  return [...tasks].sort((a, b) => {
    return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
  });
}

/**
 * Generate a unique ID
 * @returns {string} - Unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate productivity score based on completed tasks and mood
 * @param {number} completedTasks - Number of completed tasks
 * @param {number} averageMood - Average mood score (1-5)
 * @returns {number} - Productivity score (0-100)
 */
export function calculateProductivityScore(completedTasks, averageMood) {
  const taskScore = Math.min(completedTasks * 10, 70);
  const moodScore = (averageMood / 5) * 30;
  return Math.round(taskScore + moodScore);
}

/**
 * Get week data for charts
 * @param {Array} data - Array of data points with date property
 * @returns {Array} - Last 7 days of data
 */
export function getWeekData(data) {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= weekAgo && itemDate <= today;
  });
}
