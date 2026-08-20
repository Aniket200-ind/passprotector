//! src/components/features/ToggleGenerator.tsx

"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const ToggleGenerator = () => {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = pathname.includes("password") ? "password" : "passphrase";

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={(value) =>
        router.push(`/generate/${value}`, { scroll: false })
      }
      className="w-full max-w-sm mt-8 mb-4 flex justify-center"
      aria-label="Toggle between password and passphrase generator"
    >
      <TabsList
        className={cn("rounded-lg", "bg-golden/30 border border-golden")}
      >
        <TabsTrigger
          value="password"
          className={cn(
            "px-3 py-2 rounded-md transition-all duration-300 cursor-pointer",
            activeTab === "password"
              ? "text-cyberBlue bg-deepPurple shadow-cyberpunk"
              : "text-white hover:text-cyberBlue",
          )}
          aria-label="Generate password"
        >
          🔐 Password
        </TabsTrigger>
        <TabsTrigger
          value="passphrase"
          className={cn(
            "px-3 py-2 rounded-md transition-all duration-300 cursor-pointer",
            activeTab === "passphrase"
              ? "text-synthwavePink bg-deepPurple shadow-cyberpunk"
              : "text-white hover:text-synthwavePink",
          )}
          aria-label="Generate passphrase"
        >
          🔑 Passphrase
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ToggleGenerator;
