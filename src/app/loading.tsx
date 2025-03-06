//! src/app/loading.tsx

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import "@/app/globals.css"; // Ensure the global styles are loaded

export default function LoadingScreen() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      setIsUnlocked(true);
    }, 3000); // Unlocks after 3 seconds

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="loading-container">
      {/* Binary scrolling background */}
      <div className="binary-overlay">
        {[...Array(150)].map((_, i) => (
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
        {isUnlocked ? <Unlock size={80} color="gold" /> : <Lock size={80} color="gold" className="animate-pulse" />}
      </motion.div>
    </div>
  );
}
