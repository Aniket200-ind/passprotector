//! src/app/(generation)/generate/password/page.tsx

import { PasswordGenerator } from "@/components/features/PasswordGenerator";
import ToggleGenerator from "@/components/features/ToggleGenerator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Generator | PassProtector",
  description:
    "Generate strong, secure passwords with our customizable password generator tool.",
};

export default function PasswordGeneratorPage() {
  return (
    <main className="py-12 px-4 flex flex-col items-center">
      <ToggleGenerator />
      <h1 className="animate-fade-in-up text-3xl text-center motion-reduce:animate-none sm:text-4xl font-bold text-golden font-fancy mb-4">
        Generate Secure Passwords
      </h1>
      <p className="text-muted-foreground text-center mb-8 max-w-lg animate-fade-in-up animation-delay-100 motion-reduce:animate-none">
        Create strong, unique passwords with our customizable generator tool.
      </p>
      <div className="w-full max-w-md">
        <PasswordGenerator />
      </div>
    </main>
  );
}
