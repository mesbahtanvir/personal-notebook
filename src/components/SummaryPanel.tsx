"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasks } from "@/store/useTasks";
import { useMoods } from "@/store/useMoods";

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function SummaryPanel() {
  const tasks = useTasks((s) => s.tasks);
  const moods = useMoods((s) => s.moods);

  const { completedToday, masteryCount, pleasureCount, avgMood } = useMemo(() => {
    const today = new Date();
    const completedToday = tasks.filter((t) => t.completedAt && isSameDay(new Date(t.completedAt), today)).length;
    const todaysTasks = tasks.filter((t) => t.createdAt && isSameDay(new Date(t.createdAt), today));
    const masteryCount = todaysTasks.filter((t) => t.category === "mastery").length;
    const pleasureCount = todaysTasks.filter((t) => t.category === "pleasure").length;
    const todaysMoods = moods.filter((m) => m.createdAt && isSameDay(new Date(m.createdAt), today));
    const avgMood = todaysMoods.length ? todaysMoods.reduce((a, b) => a + (b.value || 0), 0) / todaysMoods.length : 0;
    return { completedToday, masteryCount, pleasureCount, avgMood };
  }, [tasks, moods]);

  const totalCat = masteryCount + pleasureCount || 1;
  const masteryPct = (masteryCount / totalCat) * 100;
  const pleasurePct = (pleasureCount / totalCat) * 100;

  // Donut chart config for mastery vs pleasure
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const masteryLen = (masteryPct / 100) * circumference;
  const pleasureLen = (pleasurePct / 100) * circumference;

  // Radial progress for completed tasks
  const completedRadius = 28;
  const completedCirc = 2 * Math.PI * completedRadius;
  const completedNorm = Math.min(100, completedToday); // cap for circle fill
  const completedLen = (completedNorm / 100) * completedCirc;

  // Mood average gauge (semi-circle)
  const moodPct = Math.max(0, Math.min(1, avgMood / 10));

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tasks Completed Today</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0">
            <circle cx="48" cy="48" r={completedRadius} stroke="var(--muted)" strokeWidth="8" fill="none" opacity="0.3" />
            <motion.circle
              cx="48"
              cy="48"
              r={completedRadius}
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${completedLen} ${completedCirc}`}
              strokeLinecap="round"
              transform="rotate(-90 48 48)"
              initial={{ strokeDasharray: `0 ${completedCirc}` }}
              animate={{ strokeDasharray: `${completedLen} ${completedCirc}` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
            <text x="50%" y="52%" textAnchor="middle" className="fill-foreground text-sm" dominantBaseline="middle">
              {completedToday}
            </text>
          </svg>
          <div>
            <div className="text-2xl font-semibold">{completedToday}</div>
            <div className="text-sm text-muted-foreground">completed today</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mastery vs Pleasure</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0">
            <circle cx="48" cy="48" r={radius} stroke="var(--muted)" strokeWidth="10" fill="none" opacity="0.25" />
            <motion.circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#3b82f6" /* mastery */
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${masteryLen} ${circumference}`}
              strokeLinecap="butt"
              transform="rotate(-90 48 48)"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${masteryLen} ${circumference}` }}
              transition={{ duration: 0.6 }}
            />
            <motion.circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#ec4899" /* pleasure */
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${pleasureLen} ${circumference}`}
              strokeDashoffset={-masteryLen}
              strokeLinecap="butt"
              transform="rotate(-90 48 48)"
              initial={{ strokeDasharray: `0 ${circumference}`, strokeDashoffset: 0 }}
              animate={{ strokeDasharray: `${pleasureLen} ${circumference}`, strokeDashoffset: -masteryLen }}
              transition={{ duration: 0.6 }}
            />
          </svg>
          <div>
            <div className="text-sm text-muted-foreground">Today</div>
            <div className="text-sm">
              <span className="font-medium text-blue-500">Mastery</span>: {masteryCount}
            </div>
            <div className="text-sm">
              <span className="font-medium text-pink-500">Pleasure</span>: {pleasureCount}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Average Mood (Today)</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <svg width="120" height="70" viewBox="0 0 120 70" className="shrink-0">
            {/* semi-circle background */}
            <path d="M10,60 A50,50 0 0,1 110,60" stroke="var(--muted)" strokeWidth="10" fill="none" opacity="0.25" />
            {/* indicator */}
            <motion.path
              d="M10,60 A50,50 0 0,1 110,60"
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              fill="none"
              strokeDasharray={157}
              strokeDashoffset={157 * (1 - moodPct)}
              initial={{ strokeDashoffset: 157 }}
              animate={{ strokeDashoffset: 157 * (1 - moodPct) }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
            <text x="60" y="62" textAnchor="middle" className="fill-foreground text-sm">{avgMood.toFixed(1)}/10</text>
          </svg>
          <div>
            <div className="text-2xl font-semibold">{avgMood.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">average today</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
