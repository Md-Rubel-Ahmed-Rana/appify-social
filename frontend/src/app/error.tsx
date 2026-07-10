"use client";

import ErrorComponent from "@/components/errors/error";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  return <ErrorComponent error={error} reset={reset} />;
}
