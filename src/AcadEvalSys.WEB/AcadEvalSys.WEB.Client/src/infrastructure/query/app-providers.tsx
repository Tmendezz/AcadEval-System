import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@shared/components/theme-toggle/theme-provider";
import { queryClient } from "@infrastructure/query/queryClient";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "@shared/components/ui/sonner";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <ThemeProvider>{children}</ThemeProvider>
      </TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
