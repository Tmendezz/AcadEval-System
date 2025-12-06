import { useEffect, useState, useRef, useCallback } from "react";
import { authService } from "../services/auth-service";
import { useAuthStore } from "../store";

/**
 * Hook para verificar el estado de la sesión al cargar la app
 * Solo se ejecuta una vez al montar el componente
 */
export const useSessionCheck = () => {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const hasChecked = useRef(false);

  // Obtener funciones del store de forma estable
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const checkSession = useCallback(async () => {
    // Prevenir múltiples llamadas
    if (hasChecked.current) return;
    hasChecked.current = true;

    try {
      const sessionStatus = await authService.checkSession();

      if (sessionStatus.isAuthenticated && sessionStatus.user) {
        setUser(sessionStatus.user);
      } else {
        logout();
      }
    } catch {
      // En caso de error de red, cerrar sesión silenciosamente
      logout();
    } finally {
      setIsCheckingSession(false);
    }
  }, [setUser, logout]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return { isCheckingSession };
};
