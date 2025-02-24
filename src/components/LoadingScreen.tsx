"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import "@/app/globals.css"; // Ensure the global styles are loaded

export default function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      setIsUnlocked(true);
      const cleanup = setTimeout(() => {
        if (typeof onComplete === "function") {
          onComplete();
        }
      }, 1000); // Slight delay after unlock
      return () => clearTimeout(cleanup);
    }, 3000); // Lock unlocks after 3 seconds

    return () => clearTimeout(timer);
  }, [isLoading, onComplete]);

  return (
    <div className="loading-container">
      {/* Binary scrolling background */}
      <div className="binary-overlay">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="binary-scroll">
            {Array(50)
              .fill(0)
              .map(() => (Math.random() > 0.5 ? "1" : "0"))
              .join(" ")}
          </div>
        ))}
      </div>

      {/* Lock animation */}
      <motion.div
        className="lock-container"
        animate={{ scale: isUnlocked ? 1.2 : 1, rotate: isUnlocked ? 20 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isUnlocked ? <Unlock size={80} color="gold" /> : <Lock size={80} color="gold" />}
      </motion.div>
    </div>
  );
}
