import { api } from "@infrastructure/query/axios";
import { useAuthStore } from "../store";
import { User, LoginCredentials, SessionStatus } from "../models";
import { getErrorMessage } from "@/shared/utils/error-handler";

const AUTH_API_URL = "/identity";

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const store = useAuthStore.getState();

    try {
      store.setLoading(true);
      store.setError(null);

      // Llamada a la API de login
      await api.post(`${AUTH_API_URL}/login?useCookies=true`, credentials);

      // Obtener información del usuario después del login
      const userInfo = await authService.getCurrentUser();

      // Actualizar el store con la información del usuario
      store.login(userInfo);

      return userInfo;
    } catch (error: unknown) {
      // Usar el handler centralizado de errores
      const message = getErrorMessage(error);
      store.setError(message);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  /**
   * Cierra la sesión del usuario
   */
  async logout(): Promise<void> {
    const store = useAuthStore.getState();

    try {
      store.setLoading(true);

      // Llamada a la API de logout
      await api.post(`${AUTH_API_URL}/logout`);

      // Limpiar el store
      store.logout();
    } catch {
      // Aún así limpiamos el store local
      store.logout();
    } finally {
      store.setLoading(false);
    }
  },

  /**
   * Obtiene la información del usuario actual
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(`${AUTH_API_URL}/info`);
    return response.data;
  },

  /**
   * Verifica el estado de la sesión
   * Usa getCurrentUser directamente ya que es más confiable que session-check
   */
  async checkSession(): Promise<SessionStatus> {
    try {
      // Usar getCurrentUser directamente - si funciona, hay sesión válida
      const user = await authService.getCurrentUser();
      return {
        isAuthenticated: true,
        user,
      };
    } catch {
      // Si getCurrentUser falla (401/403), no hay sesión válida
      return { isAuthenticated: false };
    }
  },

  /**
   * Actualiza la información del usuario en el store
   */
  async refreshUserInfo(): Promise<void> {
    const store = useAuthStore.getState();

    try {
      const userInfo = await authService.getCurrentUser();
      store.setUser(userInfo);
    } catch {
      // Si no puede obtener la info, posiblemente la sesión expiró
      store.logout();
    }
  },
};
