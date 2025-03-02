//! src/components/layout/PasswordStrengthChecker.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  CheckCircle,
  Loader2,
  Circle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StrengthMeter } from "@/components/features/StrengthMeter";
import { debounce } from "lodash";
import SuggestionTooltip from "../features/CustomToolTip";

// Types for the API response
interface PasswordStrengthResponse {
  success: boolean;
  PasswordStrength: "VULNERABLE" | "WEAK" | "MODERATE" | "STRONG";
  score: number;
}



export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [strengthData, setStrengthData] =
    useState<PasswordStrengthResponse | null>(null);

  // Password strength border color logic
  const getBorderColor = () => {
    switch (strengthData?.PasswordStrength.toUpperCase()) {
      case "VULNERABLE":
        return "border-red-500";
      case "WEAK":
        return "border-orange-500";
      case "MODERATE":
        return "border-yellow-500";
      case "STRONG":
        return "border-green-500";
      default:
        return "border-gray-500";
    }
  };

  // Feedback messages based on strength level
  const getFeedbackMessage = (strength: string | undefined) => {
    strength = strength?.toUpperCase();

    if (!strength) return "Start typing to check your password strength.";

    switch (strength) {
      case "VULNERABLE":
        return "Extremely weak password! Easily crackable.";
      case "WEAK":
        return "Consider adding numbers, symbols, and uppercase letters.";
      case "MODERATE":
        return "Decent password, but it can be stronger.";
      case "STRONG":
        return "Strong password! You're secure.";
      default:
        return "Start typing to check your password strength.";
    }
  };

  // Make sure these functions return visible content
  const getStrengthIcon = (strength?: string) => {
    strength = strength?.toUpperCase();
    switch (strength) {
      case "VULNERABLE":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "WEAK":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "MODERATE":
        return <Info className="h-5 w-5 text-yellow-500" />;
      case "STRONG":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  //* Debounced API call to check password strength
  const checkPasswordStrength = useCallback(
    debounce(async (pwd: string) => {
      if (!pwd) {
        setStrengthData(null);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/passwords/strength", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: pwd }),
        });

        if (!response.ok) {
          throw new Error("Failed to check password strength");
        }

        const data = await response.json();
        setStrengthData(data);
      } catch (err) {
        console.error("Error checking password strength:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [setStrengthData, setIsLoading]
  );

  // Call the API when password changes
  useEffect(() => {
    checkPasswordStrength(password);
    return () => checkPasswordStrength.cancel();
  }, [password, checkPasswordStrength]);

  // Password suggestions
  const getSuggestions = () => {
    const suggestions = [
      { 
        text: "Use at least 12 characters", 
        completed: password.length >= 12,
        tooltipMessage: "Longer passwords are harder to crack. Each additional character multiplies the time needed for brute force attacks."
      },
      { 
        text: "Include numbers", 
        completed: /\d/.test(password),
        tooltipMessage: "Adding numbers increases the character set, making your password significantly more secure against dictionary attacks."
      },
      {
        text: "Include special characters",
        completed: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        tooltipMessage: "Special characters add complexity that makes passwords much harder to guess or crack."
      },
      { 
        text: "Include uppercase letters", 
        completed: /[A-Z]/.test(password),
        tooltipMessage: "Mixing upper and lowercase letters increases entropy, strengthening your password against automated attacks."
      },
      { 
        text: "Include lowercase letters", 
        completed: /[a-z]/.test(password),
        tooltipMessage: "Using lowercase letters is essential for creating diverse, hard-to-guess passwords."
      },
    ];
    
    return suggestions;
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-fancy font-bold sm:text-4xl md:text-5xl bg-gradient-to-r from-cyberBlue to-synthwavePink bg-clip-text text-transparent">
            Test Your Password&apos;s Strength Instantly
          </h2>
          <p className="max-w-[700px] font-primary mx-auto text-muted-foreground md:text-xl mt-4">
            Instantly check if your password is strong enough to withstand cyber
            attacks.
          </p>
        </motion.div>

        <div className="max-w-4xl lg:max-w-5xl mx-auto py-12 grid lg:grid-cols-2 gap-10">
          <Card className="border-none bg-secondary/40">
            <CardContent className="px-6 py-4">
              <div className="space-y-6 lg:space-y-8">
                <div
                  className={`relative border-2 rounded-lg ${getBorderColor()}`}
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a password"
                    className="border-none bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 focus:border-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="h-[60px]"> {/* Fixed height container */}
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="animate-spin text-cyberBlue" />
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <StrengthMeter
                        score={strengthData?.score || 0}
                        PasswordStrength={strengthData?.PasswordStrength || "Not checked"}
                      />
                    </motion.div>
                  )}
                </div>

                <motion.div className="mt-4 flex items-center gap-2">
                  {getStrengthIcon(strengthData?.PasswordStrength)}
                  <p className="text-sm" aria-live="polite">
                    {getFeedbackMessage(strengthData?.PasswordStrength)}
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-secondary/30 px-6 py-4 rounded-lg border text-center space-y-6">
            <h3 className="text-xl lg:text-2xl font-fancy font-semibold text-cyberBlue">
              Password Suggestions
            </h3>
            <ul className="space-y-3">
              {getSuggestions().map((suggestion, index) => (
                <li key={index} className="flex items-center">
                  <div className="flex items-center flex-1">
                    {suggestion.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/50 mr-2 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${
                      suggestion.completed ? "text-green-400" : "text-white"
                    }`}>
                      {suggestion.text}
                    </span>
                    <SuggestionTooltip message={suggestion.tooltipMessage} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
