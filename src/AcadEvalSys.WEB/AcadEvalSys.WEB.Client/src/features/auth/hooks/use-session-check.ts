import { useEffect, useState } from "react";
import { authService } from "../services/auth-service";
import { useAuthStore } from "../store";

// Variable global para evitar múltiples llamadas simultáneas
let sessionCheckPromise: Promise<void> | null = null;
let hasCheckedGlobally = false;

/**
 * Hook para verificar el estado de la sesión al cargar la app
 * Solo se ejecuta UNA VEZ globalmente, no importa cuántas veces se monte el hook
 */
export const useSessionCheck = () => {
  const [isCheckingSession, setIsCheckingSession] = useState(!hasCheckedGlobally);

  useEffect(() => {
    // Si ya se verificó globalmente, no hacer nada
    if (hasCheckedGlobally) {
      setIsCheckingSession(false);
      return;
    }

    // Si ya hay una verificación en curso, esperar a que termine
    if (sessionCheckPromise) {
      sessionCheckPromise.then(() => setIsCheckingSession(false));
      return;
    }

    // Marcar que se está verificando globalmente
    hasCheckedGlobally = true;

    // Crear la promesa de verificación
    sessionCheckPromise = (async () => {
      try {
        const sessionStatus = await authService.checkSession();
        const { setUser, logout } = useAuthStore.getState();

        if (sessionStatus.isAuthenticated && sessionStatus.user) {
          setUser(sessionStatus.user);
        } else {
          logout();
        }
      } catch {
        // En caso de error de red, cerrar sesión silenciosamente
        const { logout } = useAuthStore.getState();
        logout();
      } finally {
        setIsCheckingSession(false);
        sessionCheckPromise = null;
      }
    })();
  }, []);

  return { isCheckingSession };
};
