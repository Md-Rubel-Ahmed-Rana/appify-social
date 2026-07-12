"use client";

import { useGetUserProfileQuery } from "@/api/auth";
import RenderColdStartDialog from "@/components/common/render-free-plan-alert";
import Feed from "@/components/feed";

export default function HomePage() {
  const { isLoading } = useGetUserProfileQuery({});

  if (isLoading) {
    return <RenderColdStartDialog open={isLoading} />;
  }

  return <Feed />;
}
