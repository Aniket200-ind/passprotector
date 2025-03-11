//! src/components/features/PasswordGenerator.tsx

"use client";

import { StrengthMeter } from "@/components/features/StrengthMeter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Loader2, RotateCw } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { constant } from "lodash";

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
  });
  const [strength, setStrength] = useState({
    score: 0,
    PasswordStrength: "",
  });

  const handleOptionChange = useCallback((option: string, checked: boolean) => {
    setOptions((prev) => ({ ...prev, [option]: checked }))
  }, [])

  const generatePassword = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/generate/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ length, ...options }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate password");
      }

      const { password: newPassword } = await response.json();
      setPassword(newPassword);

      const strengthResponse = await fetch("/api/passwords/strength", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!strengthResponse.ok) {
        throw new Error("Failed to check password strength");
      }

      const strengthData = await strengthResponse.json();
      setStrength(strengthData);
    } catch (error) {
      console.log(error);
      toast.error("[ERROR] Please select at least one character type", {
        style: {
          background: "#121212",
          color: "#FFD700",
          border: "1px solid #FF007F",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      toast.success("🔐 Password copied!", {
        style: {
          background: "#121212",
          color: "#00FFFF",
          border: "1px solid #6A0DAD",
        },
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy password", {
        style: {
          background: "#121212",
          color: "#FFD700",
          border: "1px solid #FF007F",
        },
      });
    }
  };
 
  /**
   ** Memoized options list
   * 
   ** Avoids re-rendering the options list on every render
   ** Generates the list of options based on the current state of the options object
   */ 
  const optionItems = useMemo(() => {
    return Object.keys(options).map((option) => (
      <div key={option} className="flex items-center justify-between">
        <label htmlFor={`option-${option}`} className="text-sm font-medium text-cyberBlue">
          {option
            .replace("include", "Include ")
            .replace("exclude", "Exclude ")}
        </label>
        <Switch
          id={`option-${option}`}
          checked={options[option as keyof typeof options]}
          onCheckedChange={(checked) =>
            handleOptionChange(option, checked)
          }
          disabled={isLoading}
          className="bg-cyberBlue shadow-md shadow-cyberBlue/50"
        />
      </div>
    ))
  }, [options, isLoading, handleOptionChange]);

  return (
    <Card className="w-full max-w-md mx-auto bg-charcoal shadow-lg shadow-cyberBlue/30 rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-fancy text-center text-golden drop-shadow-md">
          Password Generator 🔐
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="relative text-wrap overflow-x-auto max-w-full"
          aria-live="polite"
          tabIndex={0}
        >
          <motion.div
            className={`p-4 rounded-lg relative text-wrap overflow-x-auto max-w-full font-mono text-center text-cyberBlue ${
              password
                ? "border-2 " +
                  (strength.score < 30
                    ? "border-red-600"
                    : strength.score < 60
                    ? "border-orange-500"
                    : strength.score < 80
                    ? "border-yellow-500"
                    : "border-green-500")
                : "border-2 border-cyberBlue"
            }`}
            animate={{ scale: password ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={password || "placeholder"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                {password || "Generate a Password!"}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Button
            size="icon"
            onClick={copyToClipboard}
            disabled={!password || isLoading}
            className="h-10 w-10 bg-rose-700 hover:bg-synthwavePink shadow-md shadow-red-500/50"
            aria-label="Copy Password to Clipboard"
          >
            <Copy className="h-5 w-5 text-white" />
          </Button>
          <Button
            size="icon"
            onClick={generatePassword}
            disabled={isLoading}
            className="h-10 w-10 bg-deepPurple hover:bg-purple-600 shadow-md shadow-purple-500/50"
          >
            {isLoading ? (
              <Loader2
                className="h-5 w-5 animate-spin text-white"
                aria-hidden="true"
              />
            ) : (
              <RotateCw className="h-5 w-5 text-white" aria-hidden="true" />
            )}
          </Button>
        </div>

        <StrengthMeter
          score={strength.score}
          PasswordStrength={strength.PasswordStrength}
        />

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="length-slider" className="text-sm font-medium text-synthwavePink">
              Password Length: {length}
            </label>
            <Slider
              value={[length]}
              onValueChange={([value]) => setLength(value)}
              min={8}
              max={64}
              step={1}
              disabled={isLoading}
              className="password-slider"
              aria-label="Password Length"
              aria-valuemin={8}
              aria-valuemax={64}
              aria-valuenow={length}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="character-types" className="text-sm font-medium text-synthwavePink">
              Character Types
            </label>
            <div className="grid gap-2">
              {optionItems}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Toaster position="bottom-right" />
      </CardFooter>
    </Card>
  );
}
