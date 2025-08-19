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
      const message = error.response?.data?.message || "Error al iniciar sesión";
      toast.error(message);
    },
  });

  const login = async (credentials: LoginCredentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  return {
    login,
    isLoading: isLoading || loginMutation.isPending,
    error: error || loginMutation.error?.message,
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