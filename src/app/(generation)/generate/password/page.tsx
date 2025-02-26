//! src/app/(generation)/generate/password/page.tsx

import { PasswordGenerator } from "@/components/features/PasswordGenerator";

export default function PasswordGeneratorPage() {
  return (
    <main className="mx-auto p-4 min-h-screen flex items-center justify-center">
      <PasswordGenerator />
    </main>
  );
}
