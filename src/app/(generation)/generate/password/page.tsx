//! src/app/(generation)/generate/password/page.tsx

import { PasswordGenerator } from "@/components/features/PasswordGenerator";
import ToggleGenerator from "@/components/features/ToggleGenerator";

export default function PasswordGeneratorPage() {
  return (
    <main className="mx-auto py-12 px-4">
      <ToggleGenerator />
      <h1 className="opacity-0 animate-fade-in-up text-3xl motion-reduce:animate-none sm:text-4xl font-bold text-golden font-fancy text-center mb-4">
        Generate Secure Passwords
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Secure your accounts with strong, randomly generated passwords.
        Customize your password settings below to fit your needs.
      </p>
      <PasswordGenerator />
    </main>
  );
}
