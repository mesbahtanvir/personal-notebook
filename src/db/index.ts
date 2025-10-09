import Dexie, { Table } from 'dexie'

export type TaskRow = {
  id: string
  title: string
  done: boolean
  createdAt: number
}

class AppDB extends Dexie {
  tasks!: Table<TaskRow, string>

  constructor() {
    super('personal-notebook')
    this.version(1).stores({
      tasks: '&id, title, done, createdAt',
    })
  }
}

export const db = new AppDB()
