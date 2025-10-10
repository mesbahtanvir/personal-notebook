export interface Task {
  id: string
  title: string
  category: 'mastery' | 'pleasure'
  completed: boolean
  createdAt: number
  isBacklog?: boolean
}

export interface MoodEntry {
  id: string
  date: string // ISO date string
  mood: number // 1-10 scale
  note?: string
}
