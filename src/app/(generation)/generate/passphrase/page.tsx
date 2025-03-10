//! src/app/(generation)/generate/passphrase/page.tsx

import { PassphraseGenerator } from "@/components/features/PassphraseGenerator";
import ToggleGenerator from "@/components/features/ToggleGenerator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Passphrase Generator | PassProtector",
  description: "Generate memorable yet secure passphrases with our customizable generator tool."
};

export default function PassphraseGeneratorPage() {
  return (
    <main className="mx-auto py-12 px-4">
      <ToggleGenerator />
      <h1 
        className="animate-fade-in-up text-3xl sm:text-4xl font-bold text-golden text-center font-fancy mb-4 motion-reduce:animate-none"
        aria-label="Generate Secure Passphrases"
      >
        Generate Secure Passphrases
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-100 motion-reduce:animate-none">
        Passphrases are easier to remember than complex passwords while still
        providing excellent security. Customize your passphrase settings below.
      </p>
      <div className="max-w-3xl mx-auto">
        <PassphraseGenerator />
      </div>
    </main>
  );
}