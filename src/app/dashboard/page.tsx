//! src/app/dashboard/page.tsx

import DashboardComponent from "@/components/layout/DashboardComponent";
import DashboardSkeleton from "@/components/layout/DashBoardSkeleton";
import { getUserPasswordStats } from "@/lib/actions/passwordActions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Dashboard() {
  const queryClient = new QueryClient();

  try{
    await queryClient.prefetchQuery({
      queryKey: ["dashboardStats"],
      queryFn: async () => getUserPasswordStats(),
    });
  }catch (error){
    console.error("[ERROR] Error fetching dashboard stats", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardComponent />
      </Suspense>
    </HydrationBoundary>
  );
}
