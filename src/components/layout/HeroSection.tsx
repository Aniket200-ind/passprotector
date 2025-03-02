//! src/components/layout/HeroSection.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LockKeyhole, Shield, Zap, Moon, Eye, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  // Only show animations after component is mounted to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-background">
      {/* Binary background animation */}
      {mounted && (
        <div className="binary-overlay" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="binary-scroll"
              style={{
                animationDuration: `${6 + i * 0.5}s`,
                opacity: 0.1,
                transform: `translateY(${-100 + i * 20}vh)`,
              }}
            >
              {Array.from({ length: 50 }).map((_, j) => (
                <span key={j}>{Math.round(Math.random())}</span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="container relative z-10 px-4 md:px-6 py-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          {/* Lock icon with glow effect */}
          <div className="lock-container my-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="shadow-cyberpunk p-6 rounded-full bg-background/20 backdrop-blur-sm"
            >
              <LockKeyhole size={64} className="text-cyberBlue" />
            </motion.div>
          </div>

          {/* Main heading */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-fancy tracking-tight"
          >
            Secure Your <span className="text-synthwavePink">Passwords</span>,
            <br /> The Smarter Way.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            A modern,{" "}
            <span className="underline underline-offset-4 decoration-cyberBlue">
              fast
            </span>
            ,{" "}
            <span className="underline underline-offset-4 decoration-golden">
              free
            </span>
            , and{" "}
            <span className="underline underline-offset-4 decoration-synthwavePink">
              secure
            </span>{" "}
            password manager powered by advanced encryption.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-synthwavePink to-cyberBlue hover:opacity-90 transition-all duration-300 transform hover:scale-105 text-white font-medium"
              aria-label="Get Started"
              aria-hidden="true"
            >
              <Link href="/login" prefetch={true}>
                Get Started
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToFeatures}
              className="border-cyberBlue text-cyberBlue hover:bg-cyberBlue/10 transition-all duration-300 transform hover:scale-105"
              aria-label="Explore Features"
              aria-hidden="true"
            >
              Explore Features
            </Button>
          </motion.div>

          {/* Feature points */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12 w-full max-w-3xl"
          >
            {[
              {
                icon: <Shield className="h-5 w-5 text-cyberBlue" />,
                text: "AES-256-GCM Encryption",
              },
              {
                icon: <Eye className="h-5 w-5 text-synthwavePink" />,
                text: "No Weak Passwords Allowed",
              },
              {
                icon: <Zap className="h-5 w-5 text-golden" />,
                text: "Blazing Fast",
              },
              {
                icon: <Moon className="h-5 w-5 text-cyberBlue" />,
                text: "Modern UI & Dark Mode",
              },
              {
                icon: <Shield className="h-5 w-5 text-synthwavePink" />,
                text: "No Tracking. No Ads.",
              },
              {
                icon: <Code className="h-5 w-5 text-golden" />,
                text: "Open Source & Free",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="flex flex-col items-center p-4 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border hover:border-golden transition-colors duration-300 select-none"
              >
                <div className="mb-2">{feature.icon}</div>
                <p className="text-sm font-mono text-center">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Gradient overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
}
