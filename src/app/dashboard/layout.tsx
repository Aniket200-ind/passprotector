//! src/app/dashboard/layout.tsx

import { QueryProvider } from "@/components/providers/Queryprovider";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardLayout({ 
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  )
}