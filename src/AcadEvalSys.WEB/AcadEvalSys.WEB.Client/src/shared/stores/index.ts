// Central export para todos los stores de la aplicación
// Facilita las importaciones desde cualquier parte de la app

// Stores por módulo
export { useAuthStore } from '../../features/auth/store';
export { useEvaluationsStore } from '../../features/evaluations/store';
export { useAdministrationStore } from '../../features/administration/store';
export { useCareersStore } from '../../features/careers/store';
export { useDashboardStore } from '../../features/dashboard/store';
export { useSurveysStore } from '../../features/surveys/store';

// Tipos de stores (para facilitar el tipado)
export type {
  // Puedes exportar tipos específicos aquí si necesitas
  // TypeScript inferirá los tipos automáticamente de los stores
} from '../../features/auth/store/use-auth-store';

// Re-exportar create de Zustand para uso general
export { create } from 'zustand';
export { persist, subscribeWithSelector, devtools } from 'zustand/middleware';