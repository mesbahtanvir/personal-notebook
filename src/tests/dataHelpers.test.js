import {
  calculatePercentage,
  generateId,
  calculateProductivityScore,
  sortTasksByPriority,
  groupTasksByStatus,
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
});
