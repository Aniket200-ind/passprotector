//! src/components/layout/EducationSection.tsx

"use client";

import { motion } from "framer-motion";
import { LockKeyhole, ShieldCheck, Brain, Zap, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WhyUseSection() {
  // Animation variants
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      className="w-full py-16 text-white overflow-hidden"
      aria-labelledby="why-use-heading"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Illustration */}
            <motion.div
            className="flex justify-center order-2 mt-16 md:order-1 md:mt-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div
              className="relative w-full max-w-md"
              initial="initial"
              animate="animate"
              variants={floatingAnimation}
            >
              <div className="relative z-10">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-synthwavePink to-cyberBlue rounded-2xl flex items-center justify-center shadow-cyberpunk">
                  <LockKeyhole className="w-24 h-24 text-golden" />
                </div>

                {/* Password bubbles */}
                <motion.div
                  className="absolute -top-2 sm:-top-8  bg-deepPurple/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-cyberBlue/50"
                  variants={{
                    initial: { x: 0, y: 0 },
                    animate: {
                      x: [0, 10, 0],
                      y: [0, -5, 0],
                      transition: {
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      },
                    },
                  }}
                  initial="initial"
                  animate="animate"
                >
                  <span className="font-mono text-xs">P@s$w0rd123</span>
                </motion.div>

                <motion.div
                  className="absolute top-12 -right-2  bg-deepPurple/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-synthwavePink/50"
                  variants={{
                    initial: { x: 0, y: 0 },
                    animate: {
                      x: [0, -8, 0],
                      y: [0, 8, 0],
                      transition: {
                        duration: 4.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      },
                    },
                  }}
                  initial="initial"
                  animate="animate"
                >
                  <span className="font-mono text-xs">Qwerty!2345</span>
                </motion.div>

                <motion.div
                  className="absolute bottom-4  bg-deepPurple/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-golden/50"
                  variants={{
                    initial: { x: 0, y: 0 },
                    animate: {
                      x: [0, 12, 0],
                      y: [0, 10, 0],
                      transition: {
                        duration: 5.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      },
                    },
                  }}
                  initial="initial"
                  animate="animate"
                >
                  <span className="font-mono text-xs">Admin123!</span>
                </motion.div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-cyberBlue/20 blur-3xl rounded-full -z-10"></div>
            </motion.div>
          </motion.div>

          {/* Right side - Text content */}
          <motion.div
            className="order-1 md:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2
              id="why-use-heading"
              className="text-4xl md:text-5xl font-fancy font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyberBlue to-synthwavePink text-center sm:text-left"
              variants={itemVariants}
            >
              Why Use a Password Manager?
            </motion.h2>

            <motion.p
              className="text-lg text-gray-200 mb-8 text-center sm:text-left"
              variants={itemVariants}
            >
              Keeping your accounts secure shouldn&apos;t be a hassle.
            </motion.p>

            <div className="space-y-6">
              <motion.div
                className="flex items-start gap-4"
                variants={itemVariants}
              >
                <div className="mt-1 p-2 bg-deepPurple/30 rounded-lg border border-synthwavePink/50">
                  <ShieldCheck className="w-6 h-6 text-synthwavePink" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-cyberBlue">
                    Stop the Password Reuse
                  </h3>
                  <p className="text-gray-300">
                    People reuse weak passwords → Hackers love that. Each of
                    your accounts deserves a unique, strong password.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                variants={itemVariants}
              >
                <div className="mt-1 p-2 bg-deepPurple/30 rounded-lg border border-cyberBlue/50">
                  <LockKeyhole className="w-6 h-6 text-cyberBlue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-golden">
                    One Secure Vault
                  </h3>
                  <p className="text-gray-300">
                    A password manager keeps all your passwords in one safe
                    place, protected by military-grade encryption.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                variants={itemVariants}
              >
                <div className="mt-1 p-2 bg-deepPurple/30 rounded-lg border border-golden/50">
                  <Brain className="w-6 h-6 text-golden" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-synthwavePink">
                    No More Memorizing
                  </h3>
                  <p className="text-gray-300">
                    No more remembering complex passwords, we do the job
                    securely. Generate, store, and autofill with ease.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-4"
                variants={itemVariants}
              >
                <div className="mt-1 p-2 bg-deepPurple/30 rounded-lg border border-cyberBlue/50">
                  <Smartphone className="w-6 h-6 text-cyberBlue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 text-cyberBlue">
                    Cross-Device Sync
                  </h3>
                  <p className="text-gray-300">
                    Access your passwords securely from any device, anytime.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="mt-10 p-4 bg-deepPurple/20 border border-cyberBlue/30 rounded-lg"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-golden" />
                <p className="text-xl font-semibold text-white">
                  PassProtector is{" "}
                  <span className="text-golden">100% Free & Secure</span>.
                </p>
              </div>
            </motion.div>

            <motion.div className="mt-8 flex justify-center sm:justify-start" variants={itemVariants}>
              <Button className="bg-gradient-to-r from-cyberBlue to-synthwavePink hover:opacity-80 text-white px-8 py-6 rounded-lg text-lg font-semibold transition-all animate-fadeInwards outline-none">
                <Link href="/login" prefetch={true}>
                  Get Started
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
