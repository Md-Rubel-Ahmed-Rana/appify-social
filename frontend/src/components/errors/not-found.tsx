"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-8xl font-black text-primary">404</h1>

        <h2 className="mt-6 text-3xl font-bold tracking-tight">
          Page Not Found
        </h2>

        <p className="mt-3 text-muted-foreground">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or may have
          been moved.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground transition hover:opacity-90"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-2 rounded-lg border px-5 py-3 transition hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
