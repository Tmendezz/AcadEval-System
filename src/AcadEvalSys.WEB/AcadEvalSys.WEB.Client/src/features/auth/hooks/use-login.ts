import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth-service";
import { useAuthStore } from "@/features/auth/store";
import { navigate } from "wouter/use-browser-location";
import { toast } from "sonner";
import { LoginCredentials } from "@/shared/types/auth";

export const useLogin = () => {
  const { isLoading, error } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (error: any) => {
      // Extraer el mensaje del servidor si está disponible
      const serverMessage =
        error.response?.data?.detail ||
        error.response?.data?.title ||
        error.response?.data?.message;
      const message = serverMessage || "Error al iniciar sesión";

      // También actualizar el store con el error completo para que se muestre en el formulario
      const store = useAuthStore.getState();
      store.setError(error);
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
    onError: (error: any) => {
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
