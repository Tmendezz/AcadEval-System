import { api } from "@/infrastructure/query/axios";

export interface CoordinatorDto {
  userId: string;
  name: string;
  email: string;
}

export interface AssignCoordinatorRequest {
  userId: string;
}

export const coordinatorService = {
  async getCareerCoordinator(careerId: string): Promise<CoordinatorDto | null> {
    try {
      const { data } = await api.get(`/technical-careers/${careerId}/coordinator`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async assignCoordinator(careerId: string, userId: string): Promise<void> {
    await api.put(`/technical-careers/${careerId}/coordinator`, { userId });
  },

  async removeCoordinator(careerId: string): Promise<void> {
    await api.delete(`/technical-careers/${careerId}/coordinator`);
  },
};
