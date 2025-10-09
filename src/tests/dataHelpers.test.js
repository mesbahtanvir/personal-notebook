import {
  calculatePercentage,
  generateId,
  calculateProductivityScore,
  sortTasksByPriority,
  groupTasksByStatus,
  addTaskToBacklog,
  removeTaskFromBacklog,
  addTaskToToday,
  markTaskDone,
  logMood,
  getCurrentDate,
} from '../utils/dataHelpers';

describe('dataHelpers', () => {
  describe('calculatePercentage', () => {
    test('should calculate percentage correctly', () => {
      expect(calculatePercentage(5, 10)).toBe(50);
      expect(calculatePercentage(3, 10)).toBe(30);
      expect(calculatePercentage(10, 10)).toBe(100);
    });

    test('should return 0 when total is 0', () => {
      expect(calculatePercentage(0, 0)).toBe(0);
    });
  });

  describe('generateId', () => {
    test('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    test('should generate string IDs', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });
  });

  describe('calculateProductivityScore', () => {
    test('should calculate score based on tasks and mood', () => {
      const score = calculateProductivityScore(5, 4);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    test('should cap task score at 70', () => {
      const score = calculateProductivityScore(10, 5);
      expect(score).toBe(100);
    });
  });

  describe('sortTasksByPriority', () => {
    test('should sort tasks by priority', () => {
      const tasks = [
        { id: 1, priority: 'low' },
        { id: 2, priority: 'high' },
        { id: 3, priority: 'medium' },
      ];
      const sorted = sortTasksByPriority(tasks);
      expect(sorted[0].priority).toBe('high');
      expect(sorted[1].priority).toBe('medium');
      expect(sorted[2].priority).toBe('low');
    });
  });

  describe('groupTasksByStatus', () => {
    test('should group tasks by status', () => {
      const tasks = [
        { id: 1, status: 'backlog' },
        { id: 2, status: 'today' },
        { id: 3, status: 'backlog' },
      ];
      const grouped = groupTasksByStatus(tasks);
      expect(grouped.backlog).toHaveLength(2);
      expect(grouped.today).toHaveLength(1);
    });
  });

  describe('task helpers', () => {
    test('addTaskToBacklog adds valid task and prevents duplicates', () => {
      const t1 = { id: 'a', title: 'Task A', priority: 'high' };
      const t2 = { id: 'a', title: 'Task A dup', priority: 'low' };
      const t3 = { id: 'b', title: 'Task B' };
      let tasks = [];
      tasks = addTaskToBacklog(tasks, t1);
      expect(tasks).toHaveLength(1);
      // duplicate id ignored
      tasks = addTaskToBacklog(tasks, t2);
      expect(tasks).toHaveLength(1);
      // add another
      tasks = addTaskToBacklog(tasks, t3);
      expect(tasks).toHaveLength(2);
      expect(tasks[0].status).toBe('backlog');
    });

    test('addTaskToBacklog ignores empty/invalid input', () => {
      const tasks = addTaskToBacklog([], { id: 'x', title: '' });
      expect(tasks).toHaveLength(0);
      const tasks2 = addTaskToBacklog([], null);
      expect(tasks2).toHaveLength(0);
    });

    test('removeTaskFromBacklog removes only backlog item', () => {
      const tasks = [
        { id: 'a', title: 'A', status: 'backlog' },
        { id: 'b', title: 'B', status: 'today' },
      ];
      const after = removeTaskFromBacklog(tasks, 'a');
      expect(after).toHaveLength(1);
      expect(after[0].id).toBe('b');
      // invalid id -> no change
      const after2 = removeTaskFromBacklog(after, 'zzz');
      expect(after2).toEqual(after);
    });

    test('addTaskToToday moves task and sets date', () => {
      const tasks = [
        { id: 'a', title: 'A', status: 'backlog' },
        { id: 'b', title: 'B', status: 'backlog' },
      ];
      const today = getCurrentDate();
      const after = addTaskToToday(tasks, 'b');
      const target = after.find(t => t.id === 'b');
      expect(target.status).toBe('today');
      expect(target.date).toBe(today);
      // invalid id -> unchanged
      const after2 = addTaskToToday(after, 'invalid');
      expect(after2).toEqual(after);
    });

    test('markTaskDone marks task completed or leaves unchanged for invalid id', () => {
      const tasks = [
        { id: 'a', status: 'today' },
        { id: 'b', status: 'backlog' },
      ];
      const after = markTaskDone(tasks, 'a');
      expect(after.find(t => t.id === 'a').status).toBe('completed');
      const after2 = markTaskDone(after, 'zzz');
      expect(after2).toEqual(after);
    });
  });

  describe('logMood', () => {
    test('adds a mood when none exists for date', () => {
      const moods = [];
      const today = getCurrentDate();
      const result = logMood(moods, { mood: 4, note: 'Good' });
      expect(result).toHaveLength(1);
      expect(result[0].date).toBe(today);
      expect(result[0].mood).toBe(4);
    });

    test('updates existing mood for same date', () => {
      const today = getCurrentDate();
      const moods = [{ date: today, mood: 2 }];
      const result = logMood(moods, { date: today, mood: 5, note: 'Great' });
      expect(result).toHaveLength(1);
      expect(result[0].mood).toBe(5);
      expect(result[0].note).toBe('Great');
    });

    test('ignores invalid mood or payload', () => {
      const today = getCurrentDate();
      const moods = [{ date: today, mood: 3 }];
      expect(logMood(moods, null)).toEqual(moods);
      expect(logMood(moods, { date: today, mood: 10 })).toEqual(moods);
      expect(logMood(moods, { date: today, mood: 0 })).toEqual(moods);
    });
  });
});
