//! src/components/features/PassphraseGenerator.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, RotateCw, Loader2 } from "lucide-react";
import { StrengthMeter } from "./StrengthMeter";

type PassphraseOptions = {
  wordCount: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  separator: string;
};

export function PassphraseGenerator() {
  const [passphrase, setPassphrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<PassphraseOptions>({
    wordCount: 6,
    includeNumbers: false,
    includeSymbols: false,
    separator: "-",
  });
  const [strength, setStrength] = useState({
    score: 0,
    PasswordStrength: "",
  });

  const generatePassphrase = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/generate/passphrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate passphrase");
      }

      const { passphrase: newPassphrase } = await response.json();
      setPassphrase(newPassphrase);

      // Calculate strength based on word count (simplified)
      const score = Math.min(100, (options.wordCount / 12) * 100);
      const PasswordStrength =
        score < 50 ? "Moderate" : score < 75 ? "Strong" : "Very Strong";
      setStrength({ score, PasswordStrength });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An error occurred",
        {
          style: {
            background: "#121212",
            color: "#FFD700",
            border: "1px solid #FF007F",
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!passphrase) return;
    try {
      await navigator.clipboard.writeText(passphrase);
      toast.success("Passphrase copied! 📋", {
        style: {
          background: "#121212",
          color: "#00FFFF",
          border: "1px solid #6A0DAD",
        },
        duration: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy passphrase", {
        style: {
          background: "#121212",
          color: "#FFD700",
          border: "1px solid #FF007F",
        },
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-charcoal shadow-lg shadow-cyberBlue/30 rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-fancy text-center text-golden drop-shadow-md">
          Passphrase Generator 🔑
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <motion.div
            className={`p-4 rounded-lg font-mono text-center text-cyberBlue break-all ${
              passphrase
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
            animate={{ scale: passphrase ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={passphrase || "placeholder"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                {passphrase || "Generate a Passphrase!"}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Button
            size="icon"
            onClick={copyToClipboard}
            disabled={!passphrase || isLoading}
            className="h-10 w-10 bg-synthwavePink hover:bg-red-500 shadow-md shadow-red-500/50"
          >
            <Copy className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            onClick={generatePassphrase}
            disabled={isLoading}
            className="h-10 w-10 bg-deepPurple hover:bg-purple-400 shadow-md shadow-purple-500/50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <RotateCw className="h-5 w-5" />
            )}
          </Button>
        </div>

        <StrengthMeter
          score={strength.score}
          PasswordStrength={strength.PasswordStrength}
        />

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyberBlue">
              Word Count: {options.wordCount}
            </label>
            <Slider
              value={[options.wordCount]}
              onValueChange={([value]) =>
                setOptions((prev) => ({ ...prev, wordCount: value }))
              }
              min={4}
              max={12}
              step={1}
              className="password-slider"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-synthwavePink">
              Separator
            </label>
            <Select
              value={options.separator}
              onValueChange={(value) =>
                setOptions((prev) => ({ ...prev, separator: value }))
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a separator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" "> (Space)</SelectItem>
                <SelectItem value="-"> - (Hyphen)</SelectItem>
                <SelectItem value="_"> _ (Underscore)</SelectItem>
                <SelectItem value="."> . (Dot)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="includeNumbers" className="text-sm font-medium">
              Include Numbers
            </label>
            <Switch
              id="includeNumbers"
              checked={options.includeNumbers}
              onCheckedChange={(checked) =>
                setOptions((prev) => ({ ...prev, includeNumbers: checked }))
              }
              disabled={isLoading}
              className="bg-cyberBlue shadow-md shadow-cyberBlue/50"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="includeSymbols" className="text-sm font-medium">
              Include Symbols
            </label>
            <Switch
              id="includeSymbols"
              checked={options.includeSymbols}
              onCheckedChange={(checked) =>
                setOptions((prev) => ({ ...prev, includeSymbols: checked }))
              }
              disabled={isLoading}
              className="bg-cyberBlue shadow-md shadow-cyberBlue/50"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Toaster position="bottom-right" />
      </CardFooter>
    </Card>
  );
}
