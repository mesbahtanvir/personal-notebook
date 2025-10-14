// src/__tests__/page.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import Page from '@/app/page'
import type { Task, TaskStatus, TaskCategory } from '@/store/useTasks'
import { useTasks } from '@/store/useTasks'

// Mock the module and define useTasks as a jest.fn inside the factory
jest.mock('@/store/useTasks', () => ({
  __esModule: true,
  // This jest.fn will be available via the imported useTasks symbol
  useTasks: jest.fn(),
}))

// Mock Dexie at the module level
jest.mock('dexie', () => {
  const mockDB = new Map<string, any>()

  class MockTable {
    toArray() {
      return Promise.resolve(Array.from(mockDB.values()))
    }
    add(task: any) {
      mockDB.set(task.id, task)
      return Promise.resolve(task.id)
    }
    update(id: string, changes: any) {
      if (mockDB.has(id)) {
        const task = { ...mockDB.get(id), ...changes }
        mockDB.set(id, task)
        return Promise.resolve(1)
      }
      return Promise.resolve(0)
    }
    delete(id: string) {
      return Promise.resolve(mockDB.delete(id))
    }
  }

  return {
    __esModule: true,
    default: class MockDexie {
      tasks: any
      constructor() {
        this.tasks = new MockTable()
      }
      version() {
        return {
          stores: () => ({})
        }
      }
    }
  }
})

describe('Home Page', () => {
  const mockTasks: Task[] = []
  const mockAdd = jest.fn()
  const mockToggle = jest.fn()
  const mockLoadTasks = jest.fn()

  // Mock the Zustand store with all required methods and properties
  const mockStore = {
    tasks: mockTasks,
    isLoading: false,
    add: mockAdd,
    toggle: mockToggle,
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    loadTasks: mockLoadTasks,
    getTasksByStatus: (status: TaskStatus) => mockTasks.filter(task => task.status === status),
    getTasksByCategory: (category: TaskCategory) => mockTasks.filter(task => task.category === category),
  }

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    
    // Setup the mock implementation
    ;(useTasks as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector) {
        return selector(mockStore)
      }
      return mockStore
    })
  })

  it('renders empty state', () => {
    render(<Page />)
    expect(screen.getByText(/No thoughts yet/i)).toBeInTheDocument()
  })

  it('adds a task via the form', async () => {
    render(<Page />)
    const input = screen.getByLabelText('Thought')
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'New Task' } })
      fireEvent.click(screen.getByRole('button', { name: /add/i }))
    })

    expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Task',
      category: 'mastery',
      status: 'active'
    }))
  })

  it('does not add empty task', async () => {
    render(<Page />)
    const input = screen.getByLabelText('Thought')
    
    await act(async () => {
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.click(screen.getByRole('button', { name: /add/i }))
    })
    
    expect(mockAdd).not.toHaveBeenCalled()
  })

  it('shows tasks when they exist', async () => {
    // Update the mock store with test tasks
    const testTasks: Task[] = [
      { 
        id: '1', 
        title: 'Test Task 1', 
        done: false, 
        category: 'mastery', 
        status: 'active', 
        createdAt: new Date().toISOString() 
      } as Task,
      { 
        id: '2', 
        title: 'Test Task 2', 
        done: true, 
        category: 'mastery', 
        status: 'completed', 
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString() 
      } as Task,
    ]
    
    // Create a new mock store with the test tasks
    const testStore = {
      ...mockStore,
      tasks: testTasks
    }
    
    // Update the mock implementation for this test
    ;(useTasks as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector) {
        return selector(testStore)
      }
      return testStore
    })
    
    render(<Page />)
    
    // Check that the tasks are rendered
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    expect(screen.getByText('Test Task 2')).toBeInTheDocument()
  })
})