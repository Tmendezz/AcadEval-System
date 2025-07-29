import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppProviders } from "./shared/providers/app-providers";
import { AuthRoutes } from "./routes/auth-routes";
import { AppRoutes } from "./routes/app-routes";
import { useIsAuthenticated } from "./shared/auth/stores/auth-store";
import { useSessionCheck } from "./shared/auth/hooks/use-session-check";
import { useLocation } from "wouter";

function AppRouter() {
  const isAuthenticated = useIsAuthenticated();
  const { isCheckingSession } = useSessionCheck();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated && location.startsWith("/auth")) {
      setLocation("/");
    }
  }, [isAuthenticated, location, setLocation]);

  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <AppRoutes /> : <AuthRoutes />;
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <AppProviders>
    <AppRouter />
  </AppProviders>
);
