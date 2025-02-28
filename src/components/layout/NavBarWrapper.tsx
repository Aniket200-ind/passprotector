//! src/components/layout/NavBarWrapper.tsx

"use client";

import { Navbar } from "./Navbar";
import { logout } from "@/lib/actions/auth";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export function NavbarWrapper({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const hiddenNavRoutes = ["/login"];

  const userInfo = useMemo(() => {
    return session?.user
      ? {
          name: session.user.name || "User",
          email: session.user.email || "No email provided",
          image: session.user.image || undefined,
        }
      : null;
  }, [session]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  //* Conditionally render the Navbar component based on the current route
  if (hiddenNavRoutes.includes(pathname)) return null;

  return <Navbar user={userInfo} handleLogout={handleLogout} />;
}
