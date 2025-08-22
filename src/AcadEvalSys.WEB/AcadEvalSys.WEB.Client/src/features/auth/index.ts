// Exportaciones principales del módulo de autenticación

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
} from "@/shared/types/auth";
export {
  UserRole,
  USER_ROLES,
  getRoleLabel,
  isValidRole,
} from "@/shared/types/auth";
