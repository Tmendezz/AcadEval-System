import { api } from "@/shared/config/axios";

const IDENTITY_API_URL = "/identity";

export const identityAdminService = {
  async createAdmin(payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<string> {
    const { data } = await api.post<{ id: string }>(
      `${IDENTITY_API_URL}/admins`,
      payload
    );
    return data.id;
  },
  async assignAdminRole(userEmail: string): Promise<void> {
    await api.post(`${IDENTITY_API_URL}/userRole`, {
      userEmail,
      roleName: "Admin",
    });
  },

  async removeAdminRole(userEmail: string): Promise<void> {
    await api.delete(`${IDENTITY_API_URL}/userRole`, {
      data: {
        userEmail,
        roleName: "Admin",
      },
    });
  },

  async deactivateUser(userEmail: string): Promise<void> {
    await api.post(`${IDENTITY_API_URL}/deactivate-user`, { userEmail });
  },
};
