import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth-service";
import { authStore } from "../stores/auth-store";
import { queryClient } from "@/shared/config/queryClient";
import { LoginCredentials } from "../types";
import { navigate } from "wouter/use-browser-location";
import { getErrorMessage } from "@/shared/lib/error-handler";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginCredentials) => {
      return authService.login(data);
    },
    onSuccess: async () => {
      try {
        const userData = await authService.getCurrentUser();
        authStore.getState().setAuth(userData);
        queryClient.setQueryData(authKeys.user(), userData);
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
        navigate("/");
      } catch (error) {
        console.error(
          "Error obteniendo datos del usuario después del login:",
          error
        );
      }
    },
    onError: (error) => {
      console.error("Error al iniciar sesión:", error);
    },
  });
};
