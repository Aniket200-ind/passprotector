//! src/app/page.tsx

import { auth } from "@/auth";
import { encryptAESGCM, decryptAESGCM } from "@/lib/passwords/encryption";

export default async function Page() {
  const session = await auth();
  console.log(session);

  const encryptedPassword = encryptAESGCM("carmel2018");
  const encryptedText = encryptedPassword.encryptedText;
  const IV = encryptedPassword.iv;
  const authTag = encryptedPassword.authTag;
  const decryptedText = decryptAESGCM({
    encryptedText,
    iv: IV,
    authTag: authTag,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
      <h1 className="text-4xl font-bold font-fancy">Welcome to PassProtector!</h1>
      <p className="text-lg font-primary mt-2">
        This is a basic landing page. Let&apos;s test our fonts!
      </p>

      <div className="mt-6 p-4 bg-card shadow-md rounded-lg text-sm">
        <p className="font-mono">🔒 Encrypted password: {encryptedText}</p>
        <p className="font-mono">🛡 IV: {IV}</p>
        <p className="font-mono">🔑 Auth Tag: {authTag}</p>
        <p className="font-mono text-green-400">✅ Decrypted text: {decryptedText}</p>
      </div>

      {/* Uncomment when ready */}
      {/* <button className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md font-primary hover:bg-primary/80 transition">
        Sign in
      </button> */}
    </div>
  );
}
