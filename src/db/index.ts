import Dexie, { Table } from 'dexie'
import { Task } from '@/store/useTasks'

export type TaskRow = Omit<Task, 'id'> & { id: string }

// Thoughts table row type
export type ThoughtRow = {
  id: string
  title: string
  done: boolean
  createdAt: string
}

class AppDB extends Dexie {
  tasks!: Table<TaskRow, string>
  thoughts!: Table<ThoughtRow, string>

  constructor() {
    super('personal-notebook')
    this.version(2).stores({
      tasks: '&id, title, done, category, status, createdAt, dueDate, completedAt',
    })
    this.version(3).stores({
      tasks: '&id, title, done, category, status, createdAt, dueDate, completedAt',
      thoughts: '&id, title, done, createdAt',
    })
  }
}

export const db = new AppDB()

// Helper function to convert Task to TaskRow
export function toTaskRow(task: Task): TaskRow {
  return {
    ...task,
    id: task.id,
  }
}

// Helper function to convert TaskRow to Task
export function toTask(row: TaskRow): Task {
  return {
    ...row,
    id: row.id,
  }
}
