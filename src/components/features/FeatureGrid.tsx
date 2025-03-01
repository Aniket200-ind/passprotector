//! src/components/features/FeatureGrid.tsx

"use client";

import { motion } from "framer-motion";
import {
  FeatureCard,
  type FeatureItem,
} from "@/components/features/FeatureCard";

interface FeaturesGridProps {
  features: FeatureItem[];
}

export function FeaturesGrid({ features }: FeaturesGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
      }}
    >
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} index={index} />
      ))}
    </motion.div>
  );
}
