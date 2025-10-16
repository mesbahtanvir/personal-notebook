"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed top-0 inset-x-0 z-40"
        >
          <div className="mx-auto max-w-7xl px-4 py-2">
            <div className="rounded-md border bg-yellow-50 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-900 px-3 py-2 text-sm shadow-sm">
              You are offline. Changes will be saved locally and sync when you are back online.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
