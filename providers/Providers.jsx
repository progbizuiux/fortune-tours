"use client";

import { Toaster } from "sonner";
import { QueryProvider } from "./QueryProvider";
import { LenisProvider } from "./LenisProvider";

export function Providers({ children }) {
  return (
    <QueryProvider>
      <LenisProvider>{children}</LenisProvider>
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
