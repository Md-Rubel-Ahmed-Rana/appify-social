"use client";

import AppCrushed from "@/components/errors/app-crash";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <AppCrushed error={error} reset={reset} />
      </body>
    </html>
  );
}
