"use client";

import { useTasks } from "@/store/useTasks";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

// Disable static generation for now
export const dynamic = 'force-dynamic';

type FormValues = { title: string };

export default function Page() {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const tasks = useTasks((s) => s.tasks);
  const add = useTasks((s) => s.add);
  const toggle = useTasks((s) => s.toggle);
  const [showAll, setShowAll] = useState(false);

  const recentThoughts = useMemo(() => {
    const sorted = [...tasks];
    // If tasks have createdAt, sort by it desc; otherwise rely on insertion order
    sorted.sort((a: any, b: any) => {
      const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bd - ad;
    });
    return sorted.slice(0, 3);
  }, [tasks]);

  const onSubmit = (data: FormValues) => {
    if (!data.title?.trim()) return;
    add({
      title: data.title.trim(),
      category: 'mastery', // Default category
      status: 'active',
      createdAt: new Date().toISOString()
    });
    reset();
  };

  return (
    <div className="space-y-6">
      <section className="card p-4 space-y-4">
        <h2 className="text-xl font-semibold">What&apos;s on your mind?</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <input
            aria-label="Thought"
            className="input flex-1"
            placeholder="Capture a quick thought..."
            {...register("title")}
          />
          <button className="btn-primary" type="submit">Add</button>
        </form>
      </section>

      <section className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Thoughts</h2>
          {tasks.length > 3 && (
            <button
              className="text-sm underline text-muted-foreground hover:text-foreground"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? 'Show less' : 'Show all'}
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {(showAll ? tasks : recentThoughts).length === 0 && (
            <li className="text-muted-foreground">No thoughts yet</li>
          )}
          {(showAll ? tasks : recentThoughts).map((t) => (
            <motion.li
              key={t.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <input
                id={`task-${t.id}`}
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
              />
              <label htmlFor={`task-${t.id}`} className={t.done ? "line-through text-muted-foreground" : ""}>
                {t.title}
              </label>
            </motion.li>
          ))}
        </ul>
      </section>
    </div>
  );
}
