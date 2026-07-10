"use client";

import Link from "next/link";

const AppCrushed = ({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) => {
  console.error(error);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-xl text-center">
          <h1 className="text-5xl font-black text-destructive">
            Application Error
          </h1>

          <p className="mt-4 text-muted-foreground">
            Something went seriously wrong while loading the application.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={reset}
              className="rounded-lg bg-primary px-5 py-3 text-primary-foreground"
            >
              Try Again
            </button>

            <Link href="/" className="rounded-lg border px-5 py-3">
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
};

export default AppCrushed;
