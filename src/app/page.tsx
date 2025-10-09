"use client";

import { useTasks } from "@/store/useTasks";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

type FormValues = { title: string };

export default function Page() {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const tasks = useTasks((s) => s.tasks);
  const add = useTasks((s) => s.add);
  const toggle = useTasks((s) => s.toggle);

  const onSubmit = (data: FormValues) => {
    if (!data.title?.trim()) return;
    add(data.title.trim());
    reset();
  };

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Personal Notebook</h1>
        <p className="text-slate-600">Privacy-first productivity dashboard</p>
      </header>

      <section className="card p-4 space-y-4">
        <h2 className="text-xl font-semibold">Add Task</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <input
            aria-label="Task Title"
            className="input flex-1"
            placeholder="What will you do?"
            {...register("title")}
          />
          <button className="btn-primary" type="submit">Add</button>
        </form>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <ul className="space-y-2">
          {tasks.length === 0 && (
            <li className="text-slate-500">No tasks yet</li>
          )}
          {tasks.map((t) => (
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
              <label htmlFor={`task-${t.id}`} className={t.done ? "line-through text-slate-500" : ""}>
                {t.title}
              </label>
            </motion.li>
          ))}
        </ul>
      </section>
    </main>
  );
}
