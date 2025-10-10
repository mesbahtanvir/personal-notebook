import Dexie, { Table } from 'dexie'
import { Task, MoodEntry } from '@/types'

export class FocusNotebookDB extends Dexie {
  // Define table types
  tasks!: Table<Task>
  backlog!: Table<Task>
  moods!: Table<MoodEntry>

  constructor() {
    super('FocusNotebookDB')
    
    this.version(1).stores({
      tasks: 'id, title, category, completed, createdAt, isBacklog, estimatedPleasure',
      backlog: 'id, title, category, completed, createdAt, isBacklog, estimatedPleasure',
      moods: 'id, date, mood, note'
    })
  }
}

// Export a singleton instance
export const db = new FocusNotebookDB()
