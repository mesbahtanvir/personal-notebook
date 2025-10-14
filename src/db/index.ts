import Dexie, { Table } from 'dexie'
import { Task, TaskCategory, TaskStatus } from '@/store/useTasks'

export type TaskRow = Omit<Task, 'id'> & { id: string }

class AppDB extends Dexie {
  tasks!: Table<TaskRow, string>

  constructor() {
    super('personal-notebook')
    this.version(2).stores({
      tasks: '&id, title, done, category, status, createdAt, dueDate, completedAt',
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
