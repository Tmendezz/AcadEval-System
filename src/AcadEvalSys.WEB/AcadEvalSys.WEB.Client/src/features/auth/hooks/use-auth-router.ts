import { useEffect } from "react";
import { useLocation } from "wouter";
import { useSessionCheck } from "./use-session-check";
import { useAuthStore } from "../store";

interface UseAuthRouterReturn {
  isCheckingSession: boolean;
  isAuthenticated: boolean;
  shouldShowAuthRoutes: boolean;
  shouldShowAppRoutes: boolean;
}

/**
 * Hook personalizado para manejar la lógica de routing de autenticación
 * Centraliza toda la lógica de verificación de sesión y redirecciones
 */
export function useAuthRouter(): UseAuthRouterReturn {
  const { isAuthenticated } = useAuthStore();
  const { isCheckingSession } = useSessionCheck();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Evitar redirecciones hasta terminar el chequeo de sesión
    if (isCheckingSession) return;
    // Si está autenticado y está en una ruta de auth, redirigir al dashboard
    if (isAuthenticated && location.startsWith("/auth")) {
      setLocation("/");
    }
  }, [isAuthenticated, isCheckingSession, location, setLocation]);

  return {
    isCheckingSession,
    isAuthenticated,
    shouldShowAuthRoutes: !isCheckingSession && !isAuthenticated,
    shouldShowAppRoutes: !isCheckingSession && isAuthenticated,
  };
}
