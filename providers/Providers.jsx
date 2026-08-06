"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { ThemeProvider } from "./ThemeProvider";
import { QueryProvider } from "./QueryProvider";
import { LenisProvider } from "./LenisProvider";

function ToasterProvider() {
  const { resolvedTheme } = useTheme();
  return <Toaster theme={resolvedTheme} richColors position="top-right" />;
}

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <LenisProvider>{children}</LenisProvider>
        <ToasterProvider />
      </QueryProvider>
    </ThemeProvider>
  );
}
