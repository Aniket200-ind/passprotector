//! src/app/(authentication)/login/error.tsx

"use client";

import { Button } from "@/components/ui/Button/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message") || "An error occurred.";

  return (
    <main className="flex min-h-screen items-center justify-center">
      <section className="text-center">
        <h1 className="text-2xl font-bold text-red-500">Login Error</h1>
        <p className="text-muted-foreground">{decodeURIComponent(errorMessage)}</p>
        <Link href="/" passHref>
          <Button
            variant="default"
            size="lg"
            className="font-primary transition-all duration-300 ease-in-out
                       hover:scale-105 hover:bg-red-400 hover:text-black
                       hover:shadow-golden
                       focus:outline-none focus:ring-2 focus:ring-golden focus:ring-offset-2 focus:ring-offset-background mt-8"
          >
            Return to Safety 🏠
          </Button>
        </Link>
      </section>
    </main>
  );
}
