//! src/components/layout/Navbar.tsx

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuSquare, LogOut, User, Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    image?: string;
  } | null;
  handleLogout?: () => void;
}

export function Navbar({ user, handleLogout }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/generate/password", label: "Generator" },
      { href: "/dashboard", label: "Dashboard" },
    ],
    []
  );

  return (
    <header className="fixed top-0 z-50 w-full border-b border-deepPurple-900/20 bg-charcoal/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo - Left Side */}
        <Link
          href="/"
          className="flex items-center gap-2 font-montserrat text-xl font-bold text-cyberBlue transition-colors hover:text-cyberBlue"
        >
          <Shield className="h-6 w-6 text-synthwavePink" />
          <span className="bg-gradient-to-r from-cyberBlue to-synthwavePink bg-clip-text text-transparent">
            PassProtector
          </span>
        </Link>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative font-medium text-gray-300 transition-colors hover:text-cyberBlue",
                    pathname === link.href &&
                      "text-cyberBlue after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-cyberBlue after:to-synthwavePink after:content-['']"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Section - Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-deepPurple/50 transition-all hover:border-cyberBlue/50">
                    <AvatarImage
                      src={user.image || ""}
                      alt={user.name || "User"}
                      loading="lazy"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-deepPurple to-synthwavePink text-white">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium text-gray-200">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex cursor-pointer items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex cursor-pointer items-center text-red-500 focus:text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="bg-gradient-to-r from-cyberBlue to-synthwavePink text-white hover:from-cyberBlue hover:to-synthwavePink">
              <Link href="/login">Login</Link>
            </Button>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button size="icon" className="md:hidden">
                <MenuSquare className="h-6 w-6 text-cyberBlue" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="border-r-deepPurple/20 bg-charcoal/95 backdrop-blur-xl"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-montserrat text-xl font-bold text-cyberBlue">
                  <Shield className="h-6 w-6 text-synthwavePink" />
                  <span className="bg-gradient-to-r from-cyberBlue to-synthwavePink bg-clip-text text-transparent">
                    PassProtector
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeSheet}
                    className={cn(
                      "flex items-center text-lg font-medium text-gray-300 transition-colors hover:text-cyberBlue",
                      pathname === link.href && "text-cyberBlue"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 border-t border-deepPurple/20 pt-4">
                  {user ? (
                    <>
                      <div className="mb-4 flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-deepPurple/50">
                          <AvatarImage
                            src={user.image || ""}
                            alt={user.name || "User"}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-deepPurple to-synthwavePink text-white">
                            {user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-200">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          closeSheet();
                          handleLogout?.();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full bg-gradient-to-r from-cyberBlue to-synthwavePink text-white hover:from-cyberBlue hover:to-synthwavePink"
                      onClick={closeSheet}
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
