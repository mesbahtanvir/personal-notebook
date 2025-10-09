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

/**
 * Pure helpers for task/mood state updates (immutable)
 */

/**
 * Add a task to backlog if valid and not duplicated by id
 * @param {Array} tasks - existing tasks
 * @param {Object} task - task to add { id, title, priority, ... }
 * @returns {Array}
 */
export function addTaskToBacklog(tasks, task) {
  if (!Array.isArray(tasks)) return [];
  if (!task || typeof task !== 'object') return tasks;
  const { id, title } = task;
  if (!id || !title || String(title).trim() === '') return tasks;
  const exists = tasks.some(t => t.id === id);
  if (exists) return tasks;
  return [...tasks, { ...task, status: 'backlog' }];
}

/**
 * Remove a task from backlog by id (only if it's in backlog)
 * @param {Array} tasks
 * @param {string} taskId
 * @returns {Array}
 */
export function removeTaskFromBacklog(tasks, taskId) {
  if (!Array.isArray(tasks) || !taskId) return tasks || [];
  return tasks.filter(t => !(t.id === taskId && (t.status === 'backlog' || !t.status)));
}

/**
 * Move a task to today's list (sets status and date)
 * @param {Array} tasks
 * @param {string} taskId
 * @param {string} [date]
 * @returns {Array}
 */
export function addTaskToToday(tasks, taskId, date) {
  if (!Array.isArray(tasks) || !taskId) return tasks || [];
  const today = date || getCurrentDate();
  let found = false;
  const updated = tasks.map(t => {
    if (t.id === taskId) {
      found = true;
      return { ...t, status: 'today', date: today };
    }
    return t;
  });
  return found ? updated : tasks;
}

/**
 * Mark a task as completed
 * @param {Array} tasks
 * @param {string} taskId
 * @returns {Array}
 */
export function markTaskDone(tasks, taskId) {
  if (!Array.isArray(tasks) || !taskId) return tasks || [];
  let found = false;
  const updated = tasks.map(t => {
    if (t.id === taskId) {
      found = true;
      return { ...t, status: 'completed' };
    }
    return t;
  });
  return found ? updated : tasks;
}

/**
 * Add or update a mood log for a date
 * @param {Array} moods - existing mood entries [{ date: 'YYYY-MM-DD', mood: 1-5, note?: string }]
 * @param {Object} moodObj - new mood { date, mood, note }
 * @returns {Array}
 */
export function logMood(moods, moodObj) {
  if (!Array.isArray(moods)) return [];
  if (!moodObj || typeof moodObj !== 'object') return moods;
  const date = moodObj.date || getCurrentDate();
  const mood = Number(moodObj.mood);
  if (!date || Number.isNaN(mood) || mood < 1 || mood > 5) return moods;
  const idx = moods.findIndex(m => m.date === date);
  const entry = { date, mood, note: moodObj.note || '' };
  if (idx >= 0) {
    const next = [...moods];
    next[idx] = entry;
    return next;
  }
  return [...moods, entry];
}
