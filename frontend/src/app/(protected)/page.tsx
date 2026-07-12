"use client";

import { useGetUserProfileQuery } from "@/api/auth";
import RenderColdStartDialog from "@/components/common/render-free-plan-alert";

export default function HomePage() {
  const { isLoading } = useGetUserProfileQuery({});

  if (isLoading) {
    return <RenderColdStartDialog open={isLoading} />;
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <h1 className="text-2xl font-semibold">Welcome to Appify Social</h1>
    </main>
  );
}
