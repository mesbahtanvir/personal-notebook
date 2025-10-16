"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Onboarding() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const seen = localStorage.getItem("seenOnboarding");
      if (!seen) setOpen(true);
    } catch {}
  }, []);

  const close = () => {
    try { localStorage.setItem("seenOnboarding", "true"); } catch {}
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-xl card p-6 border"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Welcome to Focus Notebook</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <div className="font-medium text-foreground">Mastery vs Pleasure</div>
                  <p>
                    Mastery tasks build skills and long-term growth. Pleasure tasks recharge you and bring enjoyment.
                    Balance both to sustain momentum.
                  </p>
                </div>
                <div>
                  <div className="font-medium text-foreground">Focus Notebook Philosophy</div>
                  <p>
                    No timers. No pressure. Capture thoughts, choose meaningful work, and reflect honestly. The goal is
                    self-awareness and steady progress.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={close}>Close</Button>
                <Button onClick={close}>Got it</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
