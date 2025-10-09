import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  test('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  test('should retrieve existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('existing'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('existing');
  });

  test('should handle complex objects', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', { count: 0 }));
    
    act(() => {
      result.current[1]({ count: 5 });
    });

    expect(result.current[0]).toEqual({ count: 5 });
  });
});
