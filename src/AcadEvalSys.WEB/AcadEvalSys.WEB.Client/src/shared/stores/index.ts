// Central export para todos los stores de la aplicación
// Facilita las importaciones desde cualquier parte de la app

// Stores por módulo
export { useAuthStore } from "../../features/auth/store";
// useEvaluationsStore removido - no se usa en ningún lado (Scope Rule)
// useAdministrationStore removido - solo usado por feature administration (Scope Rule)
// useCareersStore removido - no se usa en ningún lado (Scope Rule)
// useDashboardStore removido - no se usa en ningún lado (Scope Rule)
export { useSurveysStore } from "../../features/surveys/store";

// Tipos de stores (para facilitar el tipado)
export type {} from // Puedes exportar tipos específicos aquí si necesitas
// TypeScript inferirá los tipos automáticamente de los stores
"../../features/auth/store/use-auth-store";

// Re-exportar create de Zustand para uso general
export { create } from "zustand";
export { persist, subscribeWithSelector, devtools } from "zustand/middleware";
