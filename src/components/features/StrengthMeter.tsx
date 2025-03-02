"use client";

import { motion } from "framer-motion";
import SuggestionTooltip from "./CustomToolTip";


interface StrengthMeterProps {
  score: number;
  PasswordStrength: string;
}

export function StrengthMeter({ score, PasswordStrength }: StrengthMeterProps) {
  const getStrengthColor = (score: number) => {
    if (score < 30) return "bg-destructive shadow-red-500";
    if (score < 60) return "bg-orange-500 shadow-orange-500";
    if (score < 80) return "bg-yellow-500 shadow-yellow-500";
    return "bg-green-500 shadow-green-500";
  };

  const getEmoji = (score: number) => {
    if (score < 30) return "🟥";
    if (score < 60) return "🟧";
    if (score < 80) return "🟨";
    return "🟩";
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-cyberBlue">Password Strength</span>
          <SuggestionTooltip message="Based on length, complexity, and character variety" />
        </div>
        <motion.span
          className="text-sm font-mono font-extrabold flex items-center gap-1"
          animate={
            score < 30
              ? { x: [-2, 2, -2, 2, 0], opacity: [0.8, 1, 0.8] } // Weak password glitch effect
              : { scale: [1, 1.1, 1] } // Slight pulse for strong passwords
          }
          transition={{ duration: 0.3, repeat: 2 }}
        >
          {/* Keeping emoji separate so it retains its original color */}
          <span>{getEmoji(score)}</span>
          <span className="text-white">
            {PasswordStrength}
          </span>
        </motion.span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary relative overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getStrengthColor(score)} shadow-md`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {/* Pulsing effect */}
        <motion.div
          className="absolute inset-0 h-full w-full opacity-50"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </div>
  );
}
