"use server";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";

export const login = async () => {
    await signIn("google", { redirectTo: "/dashboard" }).catch(() => {
      redirect("/login/error?message=Login%20failed");
    });
  };

export const logout = async () => {
    await signOut({redirectTo: "/"})
}
