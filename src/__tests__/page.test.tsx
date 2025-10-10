import { render, screen, fireEvent, act } from '@testing-library/react'
import Page from '@/app/page'
import * as useTasksModule from '@/store/useTasks'

// Mock the entire module
jest.mock('@/store/useTasks')

// Type for the mocked useTasks hook
const mockUseTasks = useTasksModule.useTasks as jest.MockedFunction<typeof useTasksModule.useTasks>

describe('Home Page', () => {
  const mockTasks: { id: string; title: string; done: boolean }[] = []
  const mockAdd = jest.fn()
  const mockToggle = jest.fn()

  // Mock the Zustand store
  const mockStore = {
    tasks: mockTasks,
    add: mockAdd,
    toggle: mockToggle,
  }

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
    
    // Mock the useTasks hook to return our mock store
    mockUseTasks.mockImplementation((selector) => {
      if (selector) {
        return selector(mockStore)
      }
      return mockStore
    })
  })

  it('renders heading and empty state', () => {
    render(<Page />)
    expect(screen.getByText(/Personal Notebook/i)).toBeInTheDocument()
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument()
  })

  it('adds a task via the form', async () => {
    render(<Page />)
    const input = screen.getByLabelText('Task Title')
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Write tests' } })
      fireEvent.click(screen.getByRole('button', { name: /add/i }))
    })
    
    expect(mockAdd).toHaveBeenCalledWith('Write tests')
  })

  it('does not add empty task', async () => {
    render(<Page />)
    const input = screen.getByLabelText('Task Title')
    
    await act(async () => {
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.click(screen.getByRole('button', { name: /add/i }))
    })
    
    expect(mockAdd).not.toHaveBeenCalled()
  })

  it('shows tasks when they exist', async () => {
    // Update the mock store with test tasks
    const testTasks = [
      { id: '1', title: 'Test Task 1', done: false },
      { id: '2', title: 'Test Task 2', done: true },
    ]
    
    mockStore.tasks = testTasks
    
    render(<Page />)
    
    // Check that the tasks are rendered
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    expect(screen.getByText('Test Task 2')).toBeInTheDocument()
  })
})
