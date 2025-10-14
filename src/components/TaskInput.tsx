'use client'

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { useTasks } from '@/store/useTasks';

type TaskCategory = 'mastery' | 'pleasure';
type TaskDestination = 'today' | 'backlog';

export function TaskInput() {
  const [taskName, setTaskName] = useState('');
  const [category, setCategory] = useState<TaskCategory>('mastery');
  const [destination, setDestination] = useState<TaskDestination>('today');
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const addTask = useTasks((state) => state.add);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim()) return;

    // Add task with metadata
    addTask({
      id: Date.now().toString(),
      title: taskName.trim(),
      done: false,
      category,
      createdAt: new Date().toISOString(),
      dueDate: destination === 'today' ? new Date().toISOString().split('T')[0] : undefined,
      status: destination === 'today' ? 'active' : 'backlog'
    });

    // Show success feedback
    setShowSuccess(true);
    setTaskName('');
    
    // Reset form
    setTimeout(() => {
      setShowSuccess(false);
      inputRef.current?.focus();
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What do you want to accomplish?"
              className="input flex-1 pr-12"
              autoFocus
            />
            <button
              type="submit"
              disabled={!taskName.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add task"
            >
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="block"
                  >
                    <Check className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="plus"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="block"
                  >
                    <Plus className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Category:</span>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setCategory('mastery')}
                className={`px-3 py-1.5 text-sm font-medium rounded-l-lg border ${
                  category === 'mastery'
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-background hover:bg-accent border-border'
                }`}
              >
                Mastery
              </button>
              <button
                type="button"
                onClick={() => setCategory('pleasure')}
                className={`px-3 py-1.5 text-sm font-medium rounded-r-lg border ${
                  category === 'pleasure'
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-background hover:bg-accent border-border'
                }`}
              >
                Pleasure
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Add to:</span>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setDestination('today')}
                className={`px-3 py-1.5 text-sm font-medium rounded-l-lg border ${
                  destination === 'today'
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-background hover:bg-accent border-border'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDestination('backlog')}
                className={`px-3 py-1.5 text-sm font-medium rounded-r-lg border ${
                  destination === 'backlog'
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-background hover:bg-accent border-border'
                }`}
              >
                Backlog
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Success message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-green-600 dark:text-green-400"
          >
            Task added to {destination}!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
