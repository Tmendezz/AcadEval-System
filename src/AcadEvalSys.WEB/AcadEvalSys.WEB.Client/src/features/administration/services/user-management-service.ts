/**
 * Servicio genérico para gestión de usuarios
 * Centraliza operaciones comunes como cambio de contraseña, generación de contraseñas temporales, etc.
 */

import { api } from "@/infrastructure/query/axios";

export interface ChangePasswordRequest {
  userId: string;
  newPassword: string;
}

export interface GenerateTemporaryPasswordRequest {
  userId: string;
}

export interface GenerateTemporaryPasswordResponse {
  temporaryPassword: string;
  userId: string;
  message: string;
}

/**
 * Servicio de gestión de usuarios
 * Proporciona métodos genéricos para operaciones comunes de usuarios
 */
export const userManagementService = {
  /**
   * Cambia la contraseña de un usuario
   * @param userId - ID del usuario
   * @param newPassword - Nueva contraseña
   */
  async changePassword(userId: string, newPassword: string): Promise<void> {
    await api.post("/user-password/change", { userId, newPassword });
  },

  /**
   * Genera una contraseña temporal para un usuario
   * @param userId - ID del usuario
   * @returns Contraseña temporal generada
   */
  async generateTemporaryPassword(userId: string): Promise<GenerateTemporaryPasswordResponse> {
    const { data } = await api.post<GenerateTemporaryPasswordResponse>(
      "/user-password/generate-temporary",
      { userId }
    );
    return data;
  },

  /**
   * Verifica si un usuario existe
   * @param userId - ID del usuario
   */
  async userExists(userId: string): Promise<boolean> {
    try {
      await api.get(`/users/${userId}`);
      return true;
    } catch {
      return false;
    }
  },
};

