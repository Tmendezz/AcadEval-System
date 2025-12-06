import { useEffect, useState, useRef } from "react";
import { authService } from "../services/auth-service";
import { useAuthStore } from "../store";

/**
 * Hook para verificar el estado de la sesión al cargar la app
 * Solo se ejecuta una vez al montar el componente
 */
export const useSessionCheck = () => {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Prevenir múltiples llamadas - el ref persiste entre renders pero se resetea si el componente se desmonta y remonta
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkSession = async () => {
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
      }
    };

    checkSession();
  }, []); 

  return { isCheckingSession };
};
