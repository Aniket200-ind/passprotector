//! src/components/layout/HowItWorks.tsx

"use client";

import React from "react";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Shield, Vault, Search, Globe } from "lucide-react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Steps data
  const steps = [
    {
      id: 1,
      title: "Sign in using Google OAuth",
      description:
        "Quick & secure login using your Google account. No need to remember another password.",
      icon: Shield,
    },
    {
      id: 2,
      title: "Store and manage passwords securely",
      description:
        "Save passwords in an encrypted vault, accessible only to you.",
      icon: Vault,
    },
    {
      id: 3,
      title: "Use real-time strength analysis & generator",
      description:
        "Check password strength and generate ultra-secure passwords instantly.",
      icon: Search,
    },
    {
      id: 4,
      title: "Access passwords anytime, anywhere",
      description:
        "Your passwords are always available, securely synced across devices.",
      icon: Globe,
    },
  ];

  // Handle scroll-based step activation
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate how far we've scrolled into the section
      const scrollProgress =
        (windowHeight - sectionTop) / (sectionHeight + windowHeight);

      // Map scroll progress to steps
      if (scrollProgress < 0.2) setActiveStep(0);
      else if (scrollProgress < 0.4) setActiveStep(1);
      else if (scrollProgress < 0.6) setActiveStep(2);
      else if (scrollProgress < 0.8) setActiveStep(3);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#121212_1px,transparent_1px),linear-gradient(to_bottom,#121212_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>

      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-fancy text-center mb-12 bg-gradient-to-r from-cyberBlue to-synthwavePink bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          How PassProtector Works
        </motion.h2>

        {/* Desktop horizontal stepper */}
        <div className="hidden md:block">
          <div className="flex justify-between mb-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`flex flex-col items-center w-1/4 px-4 relative z-10 ${
                  index <= activeStep ? "opacity-100" : "opacity-50"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: index <= activeStep ? 1 : 0.5, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300 ${
                    index <= activeStep
                      ? "bg-secondary shadow-cyberpunk"
                      : "bg-secondary/30"
                  }`}
                >
                  {React.createElement(step.icon, {
                    className: `w-8 h-8 ${
                      index <= activeStep
                        ? "text-cyberBlue"
                        : "text-muted-foreground"
                    }`,
                    strokeWidth: 1.5,
                  })}
                </div>
                <div className="font-mono text-lg mb-1 text-center">
                  <span
                    className={`${
                      index <= activeStep
                        ? "text-cyberBlue"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.id.toString().padStart(2, "0")}
                  </span>
                </div>
                <h3
                  className={`font-fancy text-lg mb-2 text-center ${
                    index <= activeStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-center text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}

            {/* Progress bar */}
            <div className="absolute top-8 left-0 w-full h-0.5 bg-secondary/30">
              <motion.div
                className="h-full bg-gradient-to-r from-cyberBlue to-synthwavePink shadow-cyberpunk"
                initial={{ width: "0%" }}
                animate={{
                  width: `${(activeStep / (steps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Mobile vertical stepper */}
        <div className="md:hidden">
          <div className="relative">
            {/* Vertical progress line */}
            <div className="absolute left-7 top-0 w-0.5 h-full bg-secondary/30">
              <motion.div
                className="w-full bg-gradient-to-b from-cyberBlue to-synthwavePink shadow-cyberpunk"
                initial={{ height: "0%" }}
                animate={{
                  height: `${(activeStep / (steps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`flex items-start mb-10 relative ${
                  index <= activeStep ? "opacity-100" : "opacity-50"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: index <= activeStep ? 1 : 0.5, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full mr-4 z-10 transition-all duration-300 ${
                    index <= activeStep
                      ? "bg-secondary shadow-cyberpunk"
                      : "bg-secondary/30"
                  }`}
                >
                  {React.createElement(step.icon, {
                    className: `w-6 h-6 ${
                      index <= activeStep
                        ? "text-cyberBlue"
                        : "text-muted-foreground"
                    }`,
                    strokeWidth: 1.5,
                  })}
                </div>
                <div className="flex-1">
                  <div className="font-mono text-base mb-1">
                    <span
                      className={`${
                        index <= activeStep
                          ? "text-cyberBlue"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.id.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <h3
                    className={`font-fancy text-lg mb-2 ${
                      index <= activeStep
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
