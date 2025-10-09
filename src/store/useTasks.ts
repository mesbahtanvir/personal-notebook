import { create } from 'zustand'

export type Task = {
  id: string
  title: string
  done: boolean
}

type State = {
  tasks: Task[]
  add: (title: string) => void
  toggle: (id: string) => void
}

export const useTasks = create<State>((set) => ({
  tasks: [],
  add: (title: string) => set((s) => ({
    tasks: [
      ...s.tasks,
      { id: `${Date.now()}`, title, done: false },
    ],
  })),
  toggle: (id: string) => set((s) => ({
    tasks: s.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
  })),
}))
