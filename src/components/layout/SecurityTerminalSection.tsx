//! src/components/layout/SecurityTerminalSection.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

// Security features to be displayed
const securityFeatures = [
  "> Initializing PassProtector Security Protocols... ✅",
  "> Establishing AES-256-GCM Encryption... 🔐 [Success]",
  "> Google OAuth in place - No master passwords required. 🔑 [Active]",
  "> Rate-limiting & monitoring against brute-force attacks. 🚦 [Enabled]",
  "> Enforcing zero-knowledge password encryption... 🔏 [Secure]",
  "> Optimizing client-server requests with debounced APIs. ⚡ [Applied]",
  "> UI Performance & Cyberpunk-themed Accessibility... 🎨🚀 [Optimized]",
  "> Hybrid Security Headers protecting Edge functions. 🛑 [Set]",
  "> Secure SHA-512 hashing for duplicate password detection. 🔍 [Verified]",
  "> Ensuring user-password linkage to prevent unauthorized access. 🔗 [Confirmed]",
  "> Open-source & Transparent Development... 🆓 [Code Available]",
  "> Security Initialization Complete. 🚀 PassProtector is Now Active.",
];

export default function SecurityTerminal() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Track page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Intersection observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false); // Also pause when scrolled away
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(observerRef.current);
      }
    };
  }, []);

  // Optimized typewriter effect with fixed faster speed
  useEffect(() => {
    // Only run animation if section is visible AND tab is active
    if (!isVisible || !isTabActive || isComplete) return;

    // Clear any existing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    if (currentLineIndex < securityFeatures.length) {
      const currentLine = securityFeatures[currentLineIndex];

      if (currentCharIndex < currentLine.length) {
        // Type character by character
        animationRef.current = setTimeout(() => {
          setDisplayedLines((prev) => {
            const newLines = [...prev];
            if (!newLines[currentLineIndex]) {
              newLines[currentLineIndex] = "";
            }
            newLines[currentLineIndex] = currentLine.substring(
              0,
              currentCharIndex + 1
            );
            return newLines;
          });
          setCurrentCharIndex((prev) => prev + 1);
        }, 30); //  30ms per character typing speed
      } else {
        // Line complete, move to next line
        animationRef.current = setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 500); // Shorter pause between lines
      }
    } else {
      // All lines complete
      setIsComplete(true);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [currentLineIndex, currentCharIndex, isVisible, isTabActive, isComplete]);

  // Scroll to bottom when new line is added
  useEffect(() => {
    if (terminalRef.current && displayedLines.length > 0) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedLines]);

  // Update terminal time
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  return (
    <section
      className="w-full py-16 px-4 bg-charcoal relative overflow-hidden"
      ref={observerRef}
    >
      {/* Grid background - purely decorative */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00FF00 1px, transparent 1px), linear-gradient(to bottom, #00FF00 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-fancy font-bold text-cyberBlue"
            id="securityTerminalHeading"
          >
            <Terminal className="inline-block mr-2 mb-1" aria-hidden="true" />
            Why is PassProtector Secure?
          </h2>
        </div>

        <motion.div
          className="relative p-6 rounded-lg border border-cyberBlue/50 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)" }}
          role="region"
          aria-labelledby="securityTerminalHeading"
        >
          {/* Terminal header */}
          <div
            className="flex items-center justify-between border-b border-cyberBlue/30 pb-2 mb-4 custom-scrollbar"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#00FF00",
            }}
            aria-label="Terminal window controls"
          >
            {/* Decorative terminal buttons */}
            <div className="flex space-x-2" aria-hidden="true">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs text-cyberBlue/70 font-mono">
              PassProtector@secure:~
            </div>
            <div className="text-xs text-cyberBlue/70 font-mono" aria-label="Terminal time">
              {time}
            </div>
          </div>

          {/* Terminal content */}
          <div
            ref={terminalRef}
            className="font-mono text-sm md:text-base h-100 overflow-y-auto custom-scrollbar"
            role="log"
            aria-live="polite"
            aria-label="Security features terminal output"
            tabIndex={0}
          >
            <AnimatePresence>
              {displayedLines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-3 ${
                    line.includes("[Success]") || line.includes("✅")
                      ? "text-green-400"
                      : line.includes("[Active]") || line.includes("🔑")
                      ? "text-cyberBlue"
                      : line.includes("[Enabled]") || line.includes("🚦")
                      ? "text-yellow-400"
                      : line.includes("[Secure]") || line.includes("🔏")
                      ? "text-synthwavePink"
                      : line.includes("[Applied]") || line.includes("⚡")
                      ? "text-purple-400"
                      : line.includes("[Optimized]") || line.includes("🎨")
                      ? "text-orange-400"
                      : line.includes("[Set]") || line.includes("🛑")
                      ? "text-red-400"
                      : line.includes("[Verified]") || line.includes("🔍")
                      ? "text-blue-400"
                      : line.includes("[Confirmed]") || line.includes("🔗")
                      ? "text-indigo-400"
                      : line.includes("[Code Available]") || line.includes("🆓")
                      ? "text-teal-400"
                      : line.includes("Complete")
                      ? "text-green-400 font-bold"
                      : "text-cyberBlue"
                  }`}
                >
                  {line}
                  {index === displayedLines.length - 1 && !isComplete && (
                    <span className="inline-block w-2 h-4 ml-1 bg-cyberBlue animate-pulse"></span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Blinking cursor at the end */}
            {isComplete && (
              <div className="text-cyberBlue mt-4 border-t border-cyberBlue/30 pt-4">
                <span className="inline-block w-2 h-4 bg-cyberBlue animate-pulse mr-2"></span>
                Type <span className="text-synthwavePink font-bold">help</span>{" "}
                for more commands or{" "}
                <span className="text-synthwavePink font-bold">exit</span> to
                continue...
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
