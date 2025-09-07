import { api } from "@infrastructure/query/axios";

export const dashboardService = {
  // Obtener estadísticas del dashboard
  getDashboardStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  // Obtener actividad reciente
  getRecentActivity: async (limit = 10) => {
    const response = await api.get(`/dashboard/activity?limit=${limit}`);
    return response.data;
  },

  // Obtener notificaciones
  getNotifications: async () => {
    const response = await api.get("/dashboard/notifications");
    return response.data;
  },

  // Marcar notificación como leída
  markNotificationAsRead: async (notificationId: string) => {
    const response = await api.patch(
      `/dashboard/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // Marcar todas las notificaciones como leídas
  markAllNotificationsAsRead: async () => {
    const response = await api.patch("/dashboard/notifications/read-all");
    return response.data;
  },

  // Obtener resumen de evaluaciones
  getEvaluationsSummary: async () => {
    const response = await api.get("/dashboard/evaluations/summary");
    return response.data;
  },
};
