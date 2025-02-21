"use client";

import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("dark"); // Force dark mode by default
    }
  }, []);

  return <>{children}</>;
}
