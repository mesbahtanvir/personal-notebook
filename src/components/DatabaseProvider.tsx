'use client';

import { useEffect } from 'react';
import { useTasks } from '@/store/useTasks';

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const loadTasks = useTasks((state) => state.loadTasks);
  const isLoading = useTasks((state) => state.isLoading);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Show loading state while tasks are being loaded
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
