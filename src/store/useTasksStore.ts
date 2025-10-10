import { create } from 'zustand'
import { db } from '@/lib/db'
import { Task } from '@/types'

interface TasksState {
  tasks: Task[]
  backlog: Task[]
  isLoading: boolean
  error: string | null
}

interface TasksActions {
  // CRUD operations for tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  
  // CRUD operations for backlog
  addToBacklog: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>
  moveFromBacklog: (id: string) => Promise<void>
  removeFromBacklog: (id: string) => Promise<void>
  
  // Database sync
  loadFromDB: () => Promise<void>
  saveToDB: () => Promise<void>
  
  // Utility
  clearError: () => void
}

type TasksStore = TasksState & TasksActions

export const useTasksStore = create<TasksStore>((set, get) => ({
  // Initial state
  tasks: [],
  backlog: [],
  isLoading: false,
  error: null,

  // Task CRUD operations
  addTask: async (taskData) => {
    try {
      set({ isLoading: true, error: null })
      
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      }
      
      await db.tasks.add(newTask)
      
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add task',
        isLoading: false 
      })
    }
  },

  updateTask: async (id, updates) => {
    try {
      set({ isLoading: true, error: null })
      
      await db.tasks.update(id, updates)
      
      set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        ),
        backlog: state.backlog.map(task => 
          task.id === id ? { ...task, ...updates } : task
        ),
        isLoading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update task',
        isLoading: false 
      })
    }
  },

  deleteTask: async (id) => {
    try {
      set({ isLoading: true, error: null })
      
      await db.tasks.delete(id)
      
      set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete task',
        isLoading: false 
      })
    }
  },

  toggleTask: async (id) => {
    const state = get()
    const task = state.tasks.find(t => t.id === id)
    if (task) {
      await get().updateTask(id, { completed: !task.completed })
    }
  },

  // Backlog CRUD operations
  addToBacklog: async (taskData) => {
    try {
      set({ isLoading: true, error: null })
      
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        isBacklog: true,
      }
      
      await db.backlog.add(newTask)
      
      set((state) => ({
        backlog: [...state.backlog, newTask],
        isLoading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add to backlog',
        isLoading: false 
      })
    }
  },

  moveFromBacklog: async (id) => {
    try {
      set({ isLoading: true, error: null })
      
      const backlogTask = get().backlog.find(t => t.id === id)
      if (!backlogTask) return
      
      // Remove from backlog and add to tasks
      await db.backlog.delete(id)
      await db.tasks.add({ ...backlogTask, isBacklog: false })
      
      set((state) => ({
        backlog: state.backlog.filter(task => task.id !== id),
        tasks: [...state.tasks, { ...backlogTask, isBacklog: false }],
        isLoading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to move from backlog',
        isLoading: false 
      })
    }
  },

  removeFromBacklog: async (id) => {
    try {
      set({ isLoading: true, error: null })
      
      await db.backlog.delete(id)
      
      set((state) => ({
        backlog: state.backlog.filter(task => task.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove from backlog',
        isLoading: false 
      })
    }
  },

  // Database sync methods
  loadFromDB: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const [tasks, backlog] = await Promise.all([
        db.tasks.toArray(),
        db.backlog.toArray(),
      ])
      
      set({
        tasks,
        backlog,
        isLoading: false,
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load from database',
        isLoading: false 
      })
    }
  },

  saveToDB: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const { tasks, backlog } = get()
      
      // Clear existing data and save current state
      await Promise.all([
        db.tasks.clear(),
        db.backlog.clear(),
      ])
      
      await Promise.all([
        db.tasks.bulkAdd(tasks),
        db.backlog.bulkAdd(backlog),
      ])
      
      set({ isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save to database',
        isLoading: false 
      })
    }
  },

  // Utility
  clearError: () => set({ error: null }),
}))
