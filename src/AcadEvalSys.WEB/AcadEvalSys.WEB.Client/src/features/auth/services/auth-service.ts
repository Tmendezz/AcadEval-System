import { api } from "@/shared/config/axios-new";
import { useAuthStore } from "@/features/auth/store";
import { User, LoginCredentials, SessionStatus } from "@/shared/types/auth";

const AUTH_API_URL = "/identity";

export const authService = {

  async login(credentials: LoginCredentials): Promise<User> {
    const store = useAuthStore.getState();
    
    try {
      store.setLoading(true);
      store.setError(null);

      // Llamada a la API de login
      const response = await api.post(
        `${AUTH_API_URL}/login?useCookies=true`, 
        credentials
      );

      // Obtener información del usuario después del login
      const userInfo = await authService.getCurrentUser();
      
      // Actualizar el store con la información del usuario
      store.login(userInfo);
      
      return userInfo;
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al iniciar sesión";
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
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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
   */
  async checkSession(): Promise<SessionStatus> {
    try {
      const response = await api.get<SessionStatus>(
        `${AUTH_API_URL}/session-check`
      );
      return response.data;
    } catch (error) {
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
    } catch (error) {
      console.error("Error al actualizar información del usuario:", error);
      // Si no puede obtener la info, posiblemente la sesión expiró
      store.logout();
    }
  },



};
