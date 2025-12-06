import { User } from '../models';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acciones
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: (user) =>
        set({
          user,
          isAuthenticated: true,
          error: null,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      // SEGURIDAD: Solo persistir indicador de sesión, no datos sensibles
      // La autenticación real está en la cookie HTTP-only
      // Los datos del usuario se recargan desde el servidor al iniciar
      partialize: (state) => ({
        // Solo guardar un indicador mínimo para UX
        // El usuario se recarga desde el servidor en useSessionCheck
        isAuthenticated: state.isAuthenticated,
        // Guardar solo datos no sensibles del usuario para UI inicial
        user: state.user
          ? {
              id: state.user.id,
              name: state.user.name,
              roles: state.user.roles,
              // NO guardar email ni otros datos sensibles
            }
          : null,
      }),
    }
  )
);