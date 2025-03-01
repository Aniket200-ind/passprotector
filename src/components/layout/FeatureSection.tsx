//! src/components/layout/FeatureSection.tsx

"use client";

import { useEffect, useState } from "react";
import { FeaturesGrid } from "@/components/features/FeatureGrid";
import { FeaturesCarousel } from "@/components/features/FeatureCarousel";
import type { FeatureItem } from "@/components/features/FeatureCard";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Shield,
  Copy,
  Cloud,
  Search,
  AlertTriangle,
  LockKeyholeIcon,
} from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesShowcase() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>;
  
    const checkIfMobile = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 2000); // Debounce delay
    };
  
    // Initial check
    checkIfMobile();
  
    // Add event listener
    window.addEventListener("resize", checkIfMobile);
  
    // Cleanup
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const features: FeatureItem[] = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-cyberBlue" />,
      title: "Real-time Strength Checker",
      description:
        "Instantly analyzes password security with AI-powered insights.",
    },
    {
      icon: <KeyRound className="h-10 w-10 text-synthwavePink" />,
      title: "Passphrase Generator",
      description:
        "Generates highly secure, human-friendly passphrases using Diceware 8000+ words.",
    },
    {
      icon: <Lock className="h-10 w-10 text-golden" />,
      title: "Password Generator",
      description:
        "Generates highly secure, password with strong randomly, generated customizable passwords.",
    },
    {
      icon: <Shield className="h-10 w-10 text-cyberBlue" />,
      title: "AES-256-GCM Encryption",
      description:
        "Military-grade encryption ensures privacy even if your device is compromised.",
    },
    {
      icon: <Copy className="h-10 w-10 text-synthwavePink" />,
      title: "Quick Copy Feature",
      description:
        "Instantly copy passwords securely, reducing clipboard vulnerabilities.",
    },
    {
      icon: <Cloud className="h-10 w-10 text-golden" />,
      title: "Cloud Sync with E2E Encryption",
      description: "Access passwords securely from anywhere, anytime.",
    },
    {
      icon: <Search className="h-10 w-10 text-cyberBlue" />,
      title: "Password Duplicate Detector",
      description: "Detects weak/duplicate passwords using hashing techniques.",
    },
    {
      icon: <AlertTriangle className="h-10 w-10 text-red-600" />,
      title: "3000+ Weak Passwords Blocked",
      description:
        "Preloaded with a database of the most commonly breached passwords.",
    },
    {
      icon: <LockKeyholeIcon className="h-10 w-10 text-golden" />,
      title: "End-to-End Encryption",
      description:
        "Your passwords are encrypted and decrypted only on your device. We never see your passwords.",
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <section className="py-16 w-full">
      <div className="container px-4 mx-auto">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-fancy font-bold mb-4 bg-gradient-to-r from-cyberBlue to-synthwavePink bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Cutting-Edge Security Features
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            PassProtector combines advanced encryption with intuitive design to
            keep your digital life secure.
          </motion.p>
        </motion.div>

        {isMobile ? (
          <FeaturesCarousel features={features} />
        ) : (
          <FeaturesGrid features={features} />
        )}
      </div>
    </section>
  );
}
