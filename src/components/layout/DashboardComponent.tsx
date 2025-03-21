//! src/components/layout/Dashboard.tsx

"use client";

import {
  Home,
  Key,
  Lock,
  type LucideIcon,
  PieChart,
  Shield,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PasswordCategoryChart } from "@/components/features/PasswordCategoryChart";
import { PasswordStrengthChart } from "@/components/features/PasswordStrengthChart";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getUserPasswordStats } from "@/lib/actions/passwordActions";
import DashboardSkeleton from "./DashBoardSkeleton";

//* Static colors for chart categories
const categoryColors = {
  Personal: "hsl(var(--chart-1))",
  Work: "hsl(var(--chart-2))",
  Social: "hsl(var(--chart-3))",
  Finance: "hsl(var(--chart-4))",
  Shopping: "hsl(var(--chart-5))",
  Other: "hsl(220, 70%, 60%)",
};

//* Static colors for strength levels
const strengthColors = {
  Vulnurable: "#f8312f",
  Weak: "#ff6723",
  Moderate: "#ffb02f",
  Strong: "#22c55e",
};

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export default function DashboardComponent() {
  const {
    data,
    isLoading: isDataLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getUserPasswordStats,
  });

  // Navigation items for the sidebar
  const navItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: Home, isActive: true },
    { title: "Passwords", href: "/dashboard/passwords", icon: Key },
  ];

  //* Transform the data from the API to match the expected format
  const transformedCategoryData = data?.categoryData
    ? data.categoryData.map((item) => ({
        name: item.category || "Uncategorized",
        value: item._count,
        color:
          categoryColors[item.category as keyof typeof categoryColors] ||
          "hsl(220, 70%, 60%)",
      }))
    : [];

  const transformedStrengthData = data?.strengthData
    ? data.strengthData.map((item) => ({
        name: item.strength || "Unknown",
        value: item._count,
        color:
          strengthColors[item.strength as keyof typeof strengthColors] ||
          "#999",
      }))
    : [];

  // Show loading state
  if (isDataLoading) {
    return <DashboardSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 text-center">
        <ShieldAlert className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-500">
          Error Loading Dashboard
        </h2>
        <p className="mt-2 text-muted-foreground">
          Failed to load your dashboard data. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <SidebarProvider className="mt-12">
      {/* Sidebar */}
      <Sidebar collapsible="icon" className="mt-16">
        <SidebarContent>
          <SidebarMenu>
          <SidebarTrigger
              className="flex items-center justify-center h-10 w-10 rounded-full bg-deepPurple/40 hover:bg-deepPurple/80 transition-colors mx-2 my-1"
              aria-label="Toggle Sidebar"
              />
              <hr className="border border-synthwavePink w-full" />
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={item.isActive}
                  tooltip={item.title}
                >
                  <a href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* Main Content */}
      <SidebarInset>
        <div className="flex flex-col p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="font-fancy text-2xl font-bold">
              Dashboard Overview
            </h1>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Passwords Card */}
            <Card className="border-deepPurple/60 shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle 
                className="text-sm font-medium"
                aria-label="Total Passwords"
                aria-describedby="total-passwords"
                >
                  Total Passwords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Lock className="h-8 w-8 text-cyberBlue mr-3" />
                  <div 
                  className="text-3xl font-bold font-mono animate-fadeIn"
                  id="total-passwords"
                  aria-label="Total Passwords Count"
                  aria-live="polite"
                  aria-description="Total number of passwords in the vault"
                  >
                    {data?.totalPasswords || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weak Passwords Card */}
            <Card className="border-deepPurple/60 shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle 
                className="text-sm font-medium"
                aria-label="Weak Passwords"
                aria-describedby="weak-passwords"
                >
                  Weak Passwords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ShieldAlert className="h-8 w-8 text-red-500 mr-3" />
                  <div 
                  className="text-3xl font-bold font-mono animate-fadeIn"
                  aria-label="Weak Passwords Count"
                  aria-live="polite"
                  aria-description="Total number of weak passwords in the vault"
                  >
                    {data?.totalWeakPasswords || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strong Passwords Card */}
            <Card className="border-deepPurple/60 shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle 
                className="text-sm font-medium"
                aria-label="Strong Passwords"
                aria-describedby="strong-passwords"
                >
                  Strong Passwords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-green-500 mr-3" />
                  <div 
                  className="text-3xl font-bold font-mono animate-fadeIn"
                  aria-label="Strong Passwords Count"
                  aria-live="polite"
                  aria-description="Total number of strong passwords in the vault"
                  >
                    {data?.totalStrongPasswords || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total categories Card */}
            <Card className="border-deepPurple/60 shadow-md transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle 
                className="text-sm font-medium"
                aria-label="Total Password Categories"
                aria-describedby="total-categories"
                >
                  Total Password Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <PieChart className="h-8 w-8 text-synthwavePink mr-3" />
                  <div 
                  className="text-3xl font-bold font-mono animate-fadeIn"
                  id="total-categories"
                  aria-label="Total Password Categories Count"
                  aria-live="polite"
                  aria-description="Total number of password categories in the vault"
                  >
                    {data?.totalCategories || 0}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
            {/* Password Categories Chart */}
            <Card 
            className="border-deepPurple/60 shadow-md transition-all duration-300 hover:shadow-lg"
            role="region"
            aria-labelledby="category-chart-title"
            >
              <CardHeader>
                <CardTitle id="category-chart-title">Password Categories</CardTitle>
                <CardDescription id="category-chart-description">
                  Distribution of passwords by category
                </CardDescription>
              </CardHeader>
              <CardContent 
              className="h-[300px] sm:h-[350px] md:h-[400px]"
              aria-describedby="category-chart-description"
              aria-live="polite"
              >
                <PasswordCategoryChart data={transformedCategoryData} />
              </CardContent>
            </Card>

            {/* Password Strength Chart */}
            <Card 
            className="border-deepPurple/60 shadow-md transition-all duration-300 hover:shadow-lg"
            role="region"
            aria-labelledby="strength-chart-title"
            >
              <CardHeader>
                <CardTitle id="strength-chart-title">Password Strength</CardTitle>
                <CardDescription id="strength-chart-description">
                  Distribution of passwords by strength
                </CardDescription>
              </CardHeader>
              <CardContent
               className="h-[300px] sm:h-[350px] md:h-[400px]"
                aria-describedby="strength-chart-description"
                aria-live="polite"
               >
                <PasswordStrengthChart data={transformedStrengthData} />
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Section */}
          <Card
            className={cn(
              "border-deepPurple/40 shadow-md transition-all duration-300 hover:shadow-lg",
              "bg-gradient-to-br from-deepPurple/60 to-synthwavePink/20"
            )}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4 animate-fadeIn">
                <div className="rounded-full bg-deepPurple/50 p-3">
                  <Sparkles className="h-6 w-6 text-cyberBlue" />
                </div>
                <h3 className="text-2xl font-fancy font-bold">
                  More Features Coming Soon
                </h3>
                <p className="max-w-md">
                  We&apos;re working on exciting new features to enhance your
                  password security experience. Stay tuned for password sharing,
                  breach monitoring, and more!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
