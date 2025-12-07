import { useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth-service";
import { useAuthStore } from "../store";
import { navigate } from "wouter/use-browser-location";
import { LoginCredentials } from "../models";
import { getErrorMessage } from "@/shared/utils/error-handler";

/**
 * Hook para manejar el login de usuario
 */
export const useLogin = () => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const setError = useAuthStore((state) => state.setError);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      navigate("/");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    },
  });

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  return useMemo(
    () => ({
      login,
      isLoading: isLoading || loginMutation.isPending,
      error: error || loginMutation.error,
      isSuccess: loginMutation.isSuccess,
    }),
    [login, isLoading, loginMutation.isPending, error, loginMutation.error, loginMutation.isSuccess]
  );
};

/**
 * Hook para manejar el logout de usuario
 */
export const useLogout = () => {
  const isLoading = useAuthStore((state) => state.isLoading);

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      navigate("/auth/login");
    },
    onError: () => {
      // Redirigir de todas formas para limpiar el estado
      navigate("/auth/login");
    },
  });

  const logout = useCallback(async () => {
    return logoutMutation.mutateAsync();
  }, [logoutMutation]);

  return useMemo(
    () => ({
      logout,
      isLoading: isLoading || logoutMutation.isPending,
    }),
    [logout, isLoading, logoutMutation.isPending]
  );
};
