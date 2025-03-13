//! src/components/layout/DashBoardSkeleton.tsx

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Home,
  Key,
  Lock,
  Shield,
  ShieldAlert,
  PieChart,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardSkeleton() {
  return (
    <SidebarProvider className="mt-12">
      {/* Sidebar Skeleton */}
      <Sidebar className="border-r border-deepPurple/20 mt-16">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive tooltip="Dashboard">
                <div className="flex items-center">
                  <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Passwords">
                <div className="flex items-center">
                  <Key className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Passwords</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* Main Content Skeleton */}
      <SidebarInset>
        <div className="flex flex-col p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" /> {/* Dashboard Overview */}
            <div className="h-10 w-10 rounded-full bg-deepPurple/10" />{" "}
            {/* Sidebar toggle */}
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Passwords Card */}
            <Card className="border-deepPurple/30 shadow-sm">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32 animate-pulse bg-gradient-to-r from-deepPurple/20 to-deepPurple/40" />{" "}
                {/* Card title */}
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Lock className="h-8 w-8 text-cyberBlue/30 mr-3" />
                  <Skeleton className="h-8 w-10" /> {/* Number */}
                </div>
              </CardContent>
            </Card>

            {/* Weak Passwords Card */}
            <Card className="border-deepPurple/30 shadow-sm">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32 animate-pulse bg-gradient-to-r from-deepPurple/20 to-deepPurple/40" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ShieldAlert className="h-8 w-8 text-red-500/30 mr-3" />
                  <Skeleton className="h-8 w-10" />
                </div>
              </CardContent>
            </Card>

            {/* Strong Passwords Card */}
            <Card className="border-deepPurple/30 shadow-sm">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32 animate-pulse bg-gradient-to-r from-deepPurple/20 to-deepPurple/40" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-green-500/30 mr-3" />
                  <Skeleton className="h-8 w-10" />
                </div>
              </CardContent>
            </Card>

            {/* Total Categories Card */}
            <Card className="border-deepPurple/30 shadow-sm">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32 animate-pulse bg-gradient-to-r from-deepPurple/20 to-deepPurple/40" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <PieChart className="h-8 w-8 text-synthwavePink/30 mr-3" />
                  <Skeleton className="h-8 w-10" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid Skeleton */}
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
            {/* Password Categories Chart Skeleton */}
            <Card className="border-deepPurple/30 shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px] md:h-[400px]">
                <div className="w-full h-full flex items-center justify-center rounded-md bg-gradient-to-br from-transparent to-synthwavePink/20 animate-pulse">
                  <PieChart className="h-24 w-24 text-cyberBlue/80 opacity-50" />
                </div>
              </CardContent>
            </Card>

            {/* Password Strength Chart Skeleton */}
            <Card className="border-deepPurple/30 shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px] md:h-[400px]">
              <div className="w-full h-full flex items-center justify-center rounded-md bg-gradient-to-br from-transparent to-synthwavePink/20 animate-pulse">
                  <PieChart className="h-24 w-24 text-cyberBlue/80 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Section Skeleton */}
          <Card
            className={cn(
              "border-deepPurple/20 shadow-sm",
              "bg-gradient-to-br from-deepPurple/20 to-synthwavePink/10"
            )}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-deepPurple/20 p-3">
                  <Sparkles className="h-6 w-6 text-cyberBlue/30" />
                </div>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-4 w-3/4 max-w-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
