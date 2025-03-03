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
      className="w-full max-w-sm my-8"
    >
      <TabsList className="flex justify-center bg-charcoal p-1 rounded-lg sm:justify-start">
        <TabsTrigger
          value="password"
          className={cn(
            "px-5 py-2 rounded-md transition-all duration-300",
            activeTab === "password"
              ? "text-cyberBlue bg-deepPurple shadow-cyberpunk"
              : "text-gray-400 hover:text-cyberBlue"
          )}
        >
          🔐 Password
        </TabsTrigger>
        <TabsTrigger
          value="passphrase"
          className={cn(
            "px-5 py-2 rounded-md transition-all duration-300",
            activeTab === "passphrase"
              ? "text-synthwavePink bg-deepPurple shadow-cyberpunk"
              : "text-gray-400 hover:text-synthwavePink"
          )}
        >
          🔑 Passphrase
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ToggleGenerator;
