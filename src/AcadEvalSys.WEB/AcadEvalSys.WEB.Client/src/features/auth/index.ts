// Exportaciones principales del módulo de autenticación

// Main container component - follows Screaming Architecture
export { default as Auth } from "./auth";

// Store
export { useAuthStore } from "./store";

// Hooks
export {
  useSessionCheck,
  useAuthRouter,
  usePermissions,
  useCanEvaluate,
} from "./hooks";

// Componentes
export {
  LoginForm,
  AuthLayout,
  ForgotPasswordForm,
  AuthButton,
  AuthCardHeader,
  ProtectedRoute,
  AdminRoute,
  CoordinatorRoute,
  ProfessorRoute,
  AccessDenied,
  AuthRouter,
} from "./components";

// Tipos (re-export desde shared)
export type {
  User,
  LoginCredentials,
  SessionStatus,
  ApiError,
} from "@infrastructure/api/types/auth";
export {
  UserRole,
  USER_ROLES,
  getRoleLabel,
  isValidRole,
} from "@infrastructure/api/types/auth";
