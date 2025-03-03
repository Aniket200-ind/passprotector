//! src/components/layout/Footer.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronUp,
  Github,
  Linkedin,
  Info,
  FileText,
  BookOpen,
  Instagram,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Footer() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const currentYear = new Date().getFullYear();

  //* Show scroll button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //* Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative mt-20 border-t border-muted/30 bg-background/80 backdrop-blur-md">
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 transform items-center justify-center rounded-full bg-muted p-2 text-foreground shadow-cyberpunk transition-all duration-300 sm:hover:bg-accent sm:hover:text-accent-foreground ${
          showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-6 w-6" />
      </button>

      {/* Subtle neon border effect */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-synthwavePink/30 to-transparent"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left section - Quick Links */}
          <div className="animate-fade-in-up space-y-4">
            <h3 className="font-fancy text-lg font-semibold text-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex cursor-not-allowed items-center text-muted-foreground transition-all duration-300">
                      <Info className="mr-2 h-4 w-4" />
                      <span>About Us</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex cursor-not-allowed items-center text-muted-foreground transition-all duration-300">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Privacy Policy</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex cursor-not-allowed items-center text-muted-foreground transition-all duration-300">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Terms of Service</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex cursor-not-allowed items-center text-muted-foreground transition-all duration-300">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Technical Documentation</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Link
                href="https://github.com/Aniket200-ind/passprotector"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center text-foreground transition-all duration-300 sm:hover:text-cyberBlue"
              >
                <Github className="mr-2 h-4 w-4" />
                <span className="relative">
                  GitHub Repository
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-cyberBlue to-synthwavePink transition-all duration-300 sm:group:hover:w-full"></span>
                </span>
              </Link>
            </nav>
          </div>

          {/* Middle section - Copyright & Branding */}
          <div className="flex animate-fade-in-up flex-col items-center justify-center text-center">
            <div className="mb-4 font-mono text-xl font-bold tracking-wider text-foreground">
              <span className="text-cyberBlue">Pass</span>
              <span className="text-synthwavePink">Protector</span>
            </div>
            <p className="group text-sm text-muted-foreground transition-all duration-300 sm:hover:text-foreground">
              © {currentYear} PassProtector. All Rights Reserved.
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Secure Your Passwords Effortlessly</p>
            </div>
          </div>

          {/* Right section - Social Media & Contact */}
          <div className="animate-fade-in-up space-y-4">
            <h3 className="font-fancy text-lg font-semibold text-foreground">
              Connect
            </h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href="https://github.com/Aniket200-ind/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-muted bg-background transition-all duration-300 sm:hover:border-deepPurple sm:hover:shadow-cyberpunk"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-foreground transition-all duration-300 sm:group-[]:hover:text-deepPurple" />
              </Link>

              <Link
                href="https://www.linkedin.com/in/aniket-botre-9608901b8/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-muted bg-background transition-all duration-300 sm:hover:border-cyberBlue sm:hover:shadow-cyberpunk"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-foreground transition-all duration-300 sm:group-[]:hover:text-cyberBlue" />
              </Link>

              <Link
                href="https://www.instagram.com/aniketbotre_2604/"
                target="_blank"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-muted bg-background transition-all duration-300 sm:hover:border-synthwavePink sm:hover:shadow-cyberpunk"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-foreground transition-all duration-300 sm:group-[]:hover:text-synthwavePink" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Have suggestions/questions?
            </p>
              <p className="text-cyberBlue">
                Contact me at aniketbotre007@gmail.com
              </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyberBlue/30 to-transparent"></div>
    </footer>
  );
}
