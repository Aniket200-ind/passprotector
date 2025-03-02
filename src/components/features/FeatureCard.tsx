//! src/components/features/FeatureCard.tsx

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface FeatureItem {
  icon: ReactNode;
  title: string;
  description: string;
}

interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <motion.div
      role="article"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: index * 0.15, ease: "easeOut" }}
      className="bg-secondary backdrop-blur-sm rounded-lg p-6 border border-secondary/20 transition-all duration-300 sm:hover:shadow-lg sm:hover:animate-cyberpunk-glow select-none group"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 rounded-full bg-charcoal group-hover:bg-cyberpunk/30 transition-all mix-blend-screen duration-300">
          {feature.icon}
        </div>
        <h3 className="text-xl font-fancy font-semibold mb-2 text-white group-hover:text-cyberBlue transition-all duration-300">
          {feature.title}
        </h3>
        <p className="text-gray-400 font-primary group-hover:text-white transition-colors duration-300">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}
