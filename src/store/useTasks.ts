import { create } from 'zustand'

export type TaskStatus = 'active' | 'completed' | 'backlog'
export type TaskCategory = 'mastery' | 'pleasure'

export interface Task {
  id: string
  title: string
  done: boolean
  category: TaskCategory
  status: TaskStatus
  createdAt: string
  dueDate?: string
  completedAt?: string
}

type State = {
  tasks: Task[]
  add: (task: Omit<Task, 'id' | 'done'>) => void
  toggle: (id: string) => void
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void
  deleteTask: (id: string) => void
  getTasksByStatus: (status: TaskStatus) => Task[]
  getTasksByCategory: (category: TaskCategory) => Task[]
}

export const useTasks = create<State>((set, get) => ({
  tasks: [],
  
  add: (task) => set((state) => ({
    tasks: [
      ...state.tasks,
      {
        ...task,
        id: Date.now().toString(),
        done: false,
      },
    ],
  })),
  
  toggle: (id) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            done: !task.done,
            status: !task.done ? 'completed' : 'active',
            completedAt: !task.done ? new Date().toISOString() : undefined,
          }
        : task
    ),
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    ),
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
  
  getTasksByStatus: (status) => {
    return get().tasks.filter((task) => task.status === status)
  },
  
  getTasksByCategory: (category) => {
    return get().tasks.filter((task) => task.category === category)
  },
}))
