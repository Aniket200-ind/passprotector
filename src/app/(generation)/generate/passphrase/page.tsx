//! src/app/(generation)/generate/passphrase/page.tsx

import { PassphraseGenerator } from "@/components/features/PassphraseGenerator";
import ToggleGenerator from "@/components/features/ToggleGenerator";

export default function PassphraseGeneratorPage() {
  return (
    <main className="mx-auto py-12 px-4">
        <ToggleGenerator />
      <h1 
      className="opacity-0 animate-fade-in-up text-3xl sm:text-4xl font-bold text-golden text-center font-fancy mb-4"
      >
        Generate Secure Passphrases
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Passphrases are easier to remember than complex passwords while still
        providing excellent security. Customize your passphrase settings below.
      </p>
      <PassphraseGenerator />
    </main>
  );
}
