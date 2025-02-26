//! src/app/(authentication)/login/page.tsx

import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LockIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginButton from "./LoginButton";

export const metadata: Metadata = {
  title: "Login | PassProtector",
  description: "Secure your digital life with PassProtector",
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-charcoal p-4 sm:p-8">
      <section>
        <Card className="w-full max-w-md space-y-6 overflow-hidden transition-all duration-300 shadow-[0_0_15px] shadow-cyberBlue/50 bg-charcoal/90 backdrop-blur-lg border border-cyberBlue/30">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <LockIcon className="h-14 w-14 text-golden animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-fancy font-bold tracking-tight text-golden">
              Welcome 👋
            </CardTitle>
            <CardDescription className="text-cyberBlue/80">
              Sign in securely using your Google account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginButton />
          </CardContent>
          <CardFooter className="text-center text-sm text-synthwavePink/80 flex-1 underline underline-offset-2">
            By signing in, you trust us with your data. We take this trust very
            seriously and will never misuse your data.
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
