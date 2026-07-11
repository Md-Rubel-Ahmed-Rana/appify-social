"use client";

import { Provider } from "react-redux";
import { store } from "@/redux";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <div>{children}</div>
      <Toaster position="top-right" />
    </Provider>
  );
}
