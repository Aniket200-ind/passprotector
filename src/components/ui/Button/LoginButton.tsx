"use client";

import { Button } from "@/components/ui/Button/button";
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
      className="w-full hover:bg-golden/40 transition-all duration-300 ease-in-out py-4"
      type="button"
      onClick={handleLogin}
      disabled={loading}
    >
      {loading ? (
        <span className="animate-pulse">Signing in...</span>
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
