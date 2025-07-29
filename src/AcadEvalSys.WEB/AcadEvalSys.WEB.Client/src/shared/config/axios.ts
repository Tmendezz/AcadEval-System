import axios from "axios";
import { navigate } from "wouter/use-browser-location";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const currentPath = window.location.pathname;
    const isAuthRoute = currentPath.startsWith("/auth");
    const isLoginEndpoint = error.config?.url?.includes("/login");

    if (error.response?.status === 401 && !isAuthRoute && !isLoginEndpoint) {
      try {
        const { authStore } = await import("@/shared/auth/stores/auth-store");
        authStore.getState().clearAuth();
      } catch (e) {
        console.warn("Could not clear auth store:", e);
      }

      navigate("/auth/login");

      toast.warning("Su sesión ha expirado. Inicie sesión nuevamente.");

      return Promise.reject(
        new Error("Su sesión ha expirado. Inicie sesión nuevamente.")
      );
    }

    if (error.response?.status === 403) {
      const message = "No tiene permisos para realizar esta acción.";

      toast.error(message);
      console.warn("Access forbidden:", error.config?.url);
      return Promise.reject(new Error(message));
    }

    if (error.response?.status === 429) {
      const message =
        "Demasiados intentos. Espere un momento antes de intentar nuevamente.";

      toast.warning(message);
      return Promise.reject(new Error(message));
    }

    if (error.response?.status >= 500) {
      const message = "Error del servidor. Intente nuevamente más tarde.";

      toast.error(message);
      console.error("Server error:", error.config?.url, error.response?.status);
      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  }
);

export { api };
