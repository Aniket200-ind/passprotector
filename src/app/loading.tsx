//! src/app/loading.tsx

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LockOpen, ShieldCheck } from "lucide-react";

const LOADING_MESSAGES = [
  "Decrypting your vault...",
  "Shuffling entropy pools...",
  "Salting the hash...",
  "Locking down the perimeter...",
  "Generating cryptographic noise...",
];

export default function LoadingScreen() {
  const [columns, setColumns] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);


  // Toggle lock/unlock icon
  useEffect(() => {
    const lockInterval = setInterval(() => setUnlocked((prev) => !prev), 900);
    return () => clearInterval(lockInterval);
  }, []);

  // Cycle through loading messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1600);
    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="loading-container">
      <div className="lock-container flex flex-col items-center gap-6 px-4">
        <motion.div
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-charcoal border-2 border-cyberBlue shadow-cyberpunk"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            {unlocked ? (
              <motion.div
                key="unlocked"
                initial={{ opacity: 0, rotate: -15 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 15 }}
                transition={{ duration: 0.3 }}
              >
                <LockOpen
                  className="h-10 w-10 text-cyberBlue"
                  aria-hidden="true"
                />
              </motion.div>
            ) : (
              <motion.div
                key="locked"
                initial={{ opacity: 0, rotate: 15 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -15 }}
                transition={{ duration: 0.3 }}
              >
                <Lock
                  className="h-10 w-10 text-synthwavePink"
                  aria-hidden="true"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <h1 className="font-fancy text-3xl sm:text-4xl font-bold text-golden drop-shadow-md animate-fade-in-up">
          PassProtector
        </h1>

        <div className="relative flex justify-center items-center gap-2 text-sm text-muted-foreground w-full">
          <ShieldCheck className="h-4 w-4 text-cyberBlue" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.span
              key={messageIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="font-mono"
              role="status"
              aria-live="polite"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Indeterminate progress bar using the existing password-slider gradient */}
        <div className="relative h-1.5 w-64 overflow-hidden rounded-full bg-charcoal border border-white/5">
          <motion.div
            className="absolute inset-y-0 w-1/3 rounded-full bg-linear-to-r from-synthwavePink to-cyberBlue"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
