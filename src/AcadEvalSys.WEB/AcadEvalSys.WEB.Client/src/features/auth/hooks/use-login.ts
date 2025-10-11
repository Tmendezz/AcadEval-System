import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth-service";
import { useAuthStore } from "../store";
import { navigate } from "wouter/use-browser-location";
import { toast } from "sonner";
import { LoginCredentials } from "../models";
import { getErrorMessage } from "@/shared/utils/error-handler";

export const useLogin = () => {
  const { isLoading, error } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (error: unknown) => {
      // Usar el handler centralizado de errores
      const errorMessage = getErrorMessage(error);
      
      // Actualizar el store con el error para que se muestre en el formulario
      const store = useAuthStore.getState();
      store.setError(errorMessage);
    },
  });

  const login = async (credentials: LoginCredentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  return {
    login,
    isLoading: isLoading || loginMutation.isPending,
    error: error || loginMutation.error,
    isSuccess: loginMutation.isSuccess,
  };
};

export const useLogout = () => {
  const { isLoading } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      toast.success("Sesión cerrada correctamente");
      navigate("/auth/login");
    },
    onError: (error: unknown) => {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
      navigate("/auth/login");
    },
  });

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  return {
    logout,
    isLoading: isLoading || logoutMutation.isPending,
  };
};
