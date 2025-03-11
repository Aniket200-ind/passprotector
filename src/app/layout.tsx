//! src/app/layout.tsx

import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ThemeProvider from "@/components/theme-provider";
import { auth } from "@/auth";
import { NavbarWrapper } from "@/components/layout/NavBarWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next"

//* Load fonts with subsets and CSS variables
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-fancy",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PassProtector | Secure Your Passwords Effortlessly",
  description:
    "PassProtector is a modern and secure password manager that helps you generate, store, and manage strong passwords effortlessly. Enhance your online security with encryption, passphrase generation, password generation, and real-time strength analysis.",
  category: "password manager web app",
  applicationName: "PassProtector",
  keywords: [
    "password manager",
    "password generator",
    "password strength",
    "encryption",
    "passphrase generator",
    "security",
    "online security",
  ],
  robots: "index, follow",
  openGraph: {
    title: "PassProtector | Secure Your Passwords Effortlessly",
    description:
      "PassProtector is a modern and secure password manager that helps you generate, store, and manage strong passwords effortlessly. Enhance your online security with encryption, passphrase generation, password generation, and real-time strength analysis.",
    type: "website",
    url: "https://www.passprotector.in",
    locale: "en_US",
  },
  publisher: "Aniket Botre",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${montserrat.variable} antialiased bg-charcoal dark font-primary`}
      >
        <SessionProvider>
          <ThemeProvider>
            <main>
              <NavbarWrapper session={session} />
              {children}
            </main>
          </ThemeProvider>
        </SessionProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
