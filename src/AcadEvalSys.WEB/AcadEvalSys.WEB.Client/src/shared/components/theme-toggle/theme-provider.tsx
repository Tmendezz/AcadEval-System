import React, { useEffect } from "react";
import { useTheme } from "./theme-store";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const initializeTheme = useTheme((state) => state.initializeTheme);

  useEffect(() => {
    // Initialize theme when provider mounts
    const cleanup = initializeTheme();

    // Return cleanup function if it exists
    return cleanup;
  }, [initializeTheme]);

  return <>{children}</>;
}

// Re-export the hook from the store for convenience
export { useTheme } from "./theme-store";
