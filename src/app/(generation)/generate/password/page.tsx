//! src/app/(generation)/generate/password/page.tsx

import { PasswordGenerator } from "@/components/features/PasswordGenerator";
import ToggleGenerator from "@/components/features/ToggleGenerator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Generator | PassProtector",
  description: "Generate strong, secure passwords with our customizable password generator tool."
};

export default function PasswordGeneratorPage() {
  return (
    <main className="mx-auto py-12 px-4">
      <ToggleGenerator />
      <h1 className="animate-fade-in-up text-3xl motion-reduce:animate-none sm:text-4xl font-bold text-golden font-fancy text-center mb-4">
        Generate Secure Passwords
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-lg mx-auto animate-fade-in-up animation-delay-100 motion-reduce:animate-none">
        Create strong, unique passwords with our customizable generator tool.
      </p>
      <div className="max-w-3xl mx-auto">
        <PasswordGenerator />
      </div>
    </main>
  );
}
