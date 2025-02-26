"use client";

import { Button } from "@/components/ui/button";
import { login } from "@/lib/actions/auth";
import Image from "next/image";
import { useState } from "react";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full py-4 relative overflow-hidden rounded-lg border border-golden text-golden 
                 bg-transparent backdrop-blur-md transition-all duration-300 ease-in-out
                 hover:bg-golden/20 hover:text-white hover:shadow-[0_0_15px_#FFD700] 
                 active:scale-95 disabled:opacity-50"
      type="button"
      onClick={handleLogin}
      disabled={loading}
    >
      {loading ? (
        <span className="animate-pulse text-golden">Signing in...</span>
      ) : (
        <>
          <Image
            src="/google-logo.svg"
            alt="Google logo"
            width={20}
            height={20}
            className="mr-2"
          />
          Sign in with Google
        </>
      )}
    </Button>
  );
}
