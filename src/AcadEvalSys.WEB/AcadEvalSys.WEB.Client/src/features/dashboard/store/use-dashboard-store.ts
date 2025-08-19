import { create } from 'zustand';

interface DashboardStats {
  totalEvaluations: number;
  activeEvaluations: number;
  completedEvaluations: number;
  totalStudents: number;
  totalProfessors: number;
  totalSubjects: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'evaluation_created' | 'evaluation_completed' | 'student_enrolled' | 'professor_assigned';
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

interface EvaluationSummary {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  progress: number;
  startDate: string;
  endDate: string;
  assignmentsCount: number;
  completedAssignments: number;
}

interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface DashboardState {
  // Datos del dashboard
  stats: DashboardStats | null;
  evaluationsSummary: EvaluationSummary[];
  notifications: NotificationItem[];
  
  // Estados de carga
  isLoadingStats: boolean;
  isLoadingEvaluations: boolean;
  isLoadingNotifications: boolean;
  
  // Errores
  statsError: string | null;
  evaluationsError: string | null;
  notificationsError: string | null;
  
  // Configuración de vista
  refreshInterval: number;
  autoRefresh: boolean;
  lastRefresh: string | null;
  
  // Filtros
  activityFilter: 'all' | 'evaluations' | 'students' | 'professors';
  dateRange: {
    from: string;
    to: string;
  } | null;
  
  // Acciones para estadísticas
  setStats: (stats: DashboardStats) => void;
  setStatsLoading: (isLoading: boolean) => void;
  setStatsError: (error: string | null) => void;
  
  // Acciones para evaluaciones
  setEvaluationsSummary: (evaluations: EvaluationSummary[]) => void;
  setEvaluationsLoading: (isLoading: boolean) => void;
  setEvaluationsError: (error: string | null) => void;
  
  // Acciones para notificaciones
  setNotifications: (notifications: NotificationItem[]) => void;
  addNotification: (notification: NotificationItem) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
  setNotificationsLoading: (isLoading: boolean) => void;
  setNotificationsError: (error: string | null) => void;
  
  // Acciones de configuración
  setRefreshInterval: (interval: number) => void;
  setAutoRefresh: (enabled: boolean) => void;
  updateLastRefresh: () => void;
  
  // Acciones de filtros
  setActivityFilter: (filter: DashboardState['activityFilter']) => void;
  setDateRange: (range: DashboardState['dateRange']) => void;
  clearFilters: () => void;
  
  // Acciones de utilidad
  refreshAll: () => void;
  clearAllErrors: () => void;
  getUnreadNotificationsCount: () => number;
  getFilteredActivity: () => ActivityItem[];
}

const initialStats: DashboardStats = {
  totalEvaluations: 0,
  activeEvaluations: 0,
  completedEvaluations: 0,
  totalStudents: 0,
  totalProfessors: 0,
  totalSubjects: 0,
  recentActivity: [],
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Estado inicial
  stats: null,
  evaluationsSummary: [],
  notifications: [],
  isLoadingStats: false,
  isLoadingEvaluations: false,
  isLoadingNotifications: false,
  statsError: null,
  evaluationsError: null,
  notificationsError: null,
  refreshInterval: 30000, // 30 segundos
  autoRefresh: true,
  lastRefresh: null,
  activityFilter: 'all',
  dateRange: null,

  // Acciones para estadísticas
  setStats: (stats) => set({ stats }),
  setStatsLoading: (isLoading) => set({ isLoadingStats: isLoading }),
  setStatsError: (error) => set({ statsError: error }),

  // Acciones para evaluaciones
  setEvaluationsSummary: (evaluations) => set({ evaluationsSummary: evaluations }),

  setEvaluationsLoading: (isLoading) => set({ isLoadingEvaluations: isLoading }),
  setEvaluationsError: (error) => set({ evaluationsError: error }),

  // Acciones para notificaciones
  setNotifications: (notifications) => set({ notifications }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),
  
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    )
  })),
  
  markAllNotificationsAsRead: () => set((state) => ({
    notifications: state.notifications.map(notif => ({ ...notif, read: true }))
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(notif => notif.id !== id)
  })),
  
  setNotificationsLoading: (isLoading) => set({ isLoadingNotifications: isLoading }),
  setNotificationsError: (error) => set({ notificationsError: error }),

  // Acciones de configuración
  setRefreshInterval: (interval) => set({ refreshInterval: interval }),
  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
  updateLastRefresh: () => set({ lastRefresh: new Date().toISOString() }),

  // Acciones de filtros
  setActivityFilter: (filter) => set({ activityFilter: filter }),
  setDateRange: (range) => set({ dateRange: range }),
  clearFilters: () => set({ 
    activityFilter: 'all', 
    dateRange: null 
  }),

  // Acciones de utilidad
  refreshAll: () => {
    set({
      isLoadingStats: true,
      isLoadingEvaluations: true,
      isLoadingNotifications: true,
    });
    get().updateLastRefresh();
    // Aquí se triggearían las llamadas a la API para refrescar los datos
  },
  
  clearAllErrors: () => set({
    statsError: null,
    evaluationsError: null,
    notificationsError: null,
  }),
  
  getUnreadNotificationsCount: () => {
    const { notifications } = get();
    return notifications.filter(notif => !notif.read).length;
  },
  
  getFilteredActivity: () => {
    const { stats, activityFilter, dateRange } = get();
    if (!stats) return [];
    
    let filtered = stats.recentActivity;
    
    // Filtrar por tipo de actividad
    if (activityFilter !== 'all') {
      const typeMap = {
        evaluations: ['evaluation_created', 'evaluation_completed'],
        students: ['student_enrolled'],
        professors: ['professor_assigned'],
      };
      
      filtered = filtered.filter(activity => 
        typeMap[activityFilter]?.includes(activity.type)
      );
    }
    
    // Filtrar por rango de fechas
    if (dateRange) {
      filtered = filtered.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        return activityDate >= fromDate && activityDate <= toDate;
      });
    }
    
    return filtered;
  },
}));