import { create } from 'zustand'
import { db } from '@/lib/db'
import { MoodEntry } from '@/types'

interface MoodState {
  moods: MoodEntry[]
  isLoading: boolean
  error: string | null
}

interface MoodActions {
  // CRUD operations
  addMood: (mood: Omit<MoodEntry, 'id'>) => Promise<void>
  updateMood: (id: string, updates: Partial<MoodEntry>) => Promise<void>
  deleteMood: (id: string) => Promise<void>
  
  // Utility methods
  getMoodByDate: (date: string) => MoodEntry | undefined
  getMoodsInRange: (startDate: string, endDate: string) => MoodEntry[]
  getAverageMood: (startDate?: string, endDate?: string) => number
  
  // Database sync
  loadFromDB: () => Promise<void>
  saveToDB: () => Promise<void>
  
  // Utility
  clearError: () => void
}

type MoodStore = MoodState & MoodActions

export const useMoodStore = create<MoodStore>((set, get) => ({
  // Initial state
  moods: [],
  isLoading: false,
  error: null,

  // Mood CRUD operations
  addMood: async (moodData) => {
    try {
      set({ isLoading: true, error: null })
      
      const newMood: MoodEntry = {
        ...moodData,
        id: crypto.randomUUID(),
      }
      
      await db.moods.add(newMood)
      
      set((state) => ({
        moods: [...state.moods, newMood],
        isLoading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add mood entry',
        isLoading: false 
      })
    }
  },

  updateMood: async (id, updates) => {
    try {
      set({ isLoading: true, error: null })
      
      await db.moods.update(id, updates)
      
      set((state) => ({
        moods: state.moods.map(mood => 
          mood.id === id ? { ...mood, ...updates } : mood
        ),
        isLoading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update mood entry',
        isLoading: false 
      })
    }
  },

  deleteMood: async (id) => {
    try {
      set({ isLoading: true, error: null })
      
      await db.moods.delete(id)
      
      set((state) => ({
        moods: state.moods.filter(mood => mood.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete mood entry',
        isLoading: false 
      })
    }
  },

  // Utility methods
  getMoodByDate: (date) => {
    return get().moods.find(mood => mood.date === date)
  },

  getMoodsInRange: (startDate, endDate) => {
    const moods = get().moods
    return moods.filter(mood => 
      mood.date >= startDate && mood.date <= endDate
    )
  },

  getAverageMood: (startDate, endDate) => {
    let filteredMoods = get().moods
    
    if (startDate && endDate) {
      filteredMoods = get().getMoodsInRange(startDate, endDate)
    }
    
    if (filteredMoods.length === 0) return 0
    
    const totalMood = filteredMoods.reduce((sum, mood) => sum + mood.mood, 0)
    return Math.round((totalMood / filteredMoods.length) * 10) / 10 // Round to 1 decimal
  },

  // Database sync methods
  loadFromDB: async () => {
    try {
      set({ isLoading: true, error: null })
      
      const moods = await db.moods.toArray()
      
      set({
        moods,
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
      
      const { moods } = get()
      
      // Clear existing data and save current state
      await db.moods.clear()
      await db.moods.bulkAdd(moods)
      
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
