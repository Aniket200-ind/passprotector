"use client";

import { Button } from "@/components/ui/Button/button";
import { login } from "@/lib/actions/auth";
import Image from "next/image";

export default function LoginButton() {

  return (
    <Button
      variant="outline"
      className="w-full hover:bg-golden/40 transition-all duration-300 ease-in-out py-4"
      type="submit"
        onClick={() => login()}
    >
      <Image
        src="/google-logo.svg"
        alt="Google logo"
        width={20}
        height={20}
        className="mr-2"
      />
      Sign in with Google
    </Button>
  );
}
