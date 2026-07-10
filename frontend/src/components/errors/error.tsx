"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCcw, Home } from "lucide-react";

type Props = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

const ErrorComponent = ({ error, reset }: Props) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-6xl font-black text-destructive">Oops!</h1>

        <h2 className="mt-6 text-3xl font-bold">Something went wrong.</h2>

        <p className="mt-3 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground transition hover:opacity-90"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border px-5 py-3 transition hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorComponent;
