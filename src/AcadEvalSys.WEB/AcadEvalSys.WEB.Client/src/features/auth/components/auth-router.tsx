import { ReactNode } from "react";
import { useAuthRouter } from "@/features/auth/hooks/use-auth-router";
import { SessionLoadingScreen } from "@/shared/components/loading-screen";
import { AuthRoutes } from "@/routes/auth-routes";
import { AppRoutes } from "@/routes/app-routes";

interface AuthRouterProps {
  children?: ReactNode;
}


export function AuthRouter({ children }: AuthRouterProps) {
  const { 
    isCheckingSession, 
    shouldShowAuthRoutes, 
    shouldShowAppRoutes 
  } = useAuthRouter();

  // Mostrar loading mientras se verifica la sesión
  if (isCheckingSession) {
    return <SessionLoadingScreen />;
  }

  // Si está autenticado, mostrar las rutas de la app
  if (shouldShowAppRoutes) {
    return <AppRoutes />;
  }

  // Si no está autenticado, mostrar las rutas de auth
  if (shouldShowAuthRoutes) {
    return <AuthRoutes />;
  }

  // Fallback (no debería llegar aquí)
  return <SessionLoadingScreen />;
} 