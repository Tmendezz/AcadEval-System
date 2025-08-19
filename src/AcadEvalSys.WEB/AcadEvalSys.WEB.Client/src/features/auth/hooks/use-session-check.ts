// ✅ VERSIÓN MEJORADA de use-session-check.ts
import { useEffect, useState } from "react";
import { authService } from "../services/auth-service";
import { useAuthStore } from "../store";

export const useSessionCheck = () => {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const { setUser, setLoading, setError, logout } = useAuthStore();
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionStatus = await authService.checkSession();
        if (sessionStatus.isAuthenticated && sessionStatus.user) {
          setUser(sessionStatus.user);
        } else {
          logout();
        } 
      } catch (error) {
        console.error("Error de conexión al verificar sesión:", error);
        logout();
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  return { isCheckingSession };
};