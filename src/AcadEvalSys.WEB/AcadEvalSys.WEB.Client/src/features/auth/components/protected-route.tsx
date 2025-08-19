import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useAuthStore } from "../store";
import { useSessionCheck } from "../hooks/use-session-check";
import { UserRole, getFirstRole, hasAnyRole } from "@/shared/types/auth";
import { AccessDenied } from "./access-denied";
import { SessionLoadingScreen } from "@/shared/components/loading-screen";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  fallbackUrl?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallbackUrl = "/auth/login" 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const { isCheckingSession } = useSessionCheck();

  // Mostrar loading mientras se verifica la sesión
  if (isCheckingSession || isLoading) {
    return <SessionLoadingScreen />;
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated || !user) {
    return <Redirect to={fallbackUrl} />;
  }

  // Verificar roles si se especificaron
  if (requiredRoles.length > 0 && !hasAnyRole(user, requiredRoles)) {
    return (
      <AccessDenied 
        userRole={getFirstRole(user)}
        requiredRoles={requiredRoles}
      />
    );
  }

  return <>{children}</>;
}

// Componente específico para administradores
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[UserRole.Admin]}>
      {children}
    </ProtectedRoute>
  );
}

// Componente específico para coordinadores
export function CoordinatorRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[UserRole.Admin, UserRole.Coordinator]}>
      {children}
    </ProtectedRoute>
  );
}

// Componente específico para profesores
export function ProfessorRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={[UserRole.Admin, UserRole.Coordinator, UserRole.Professor]}>
      {children}
    </ProtectedRoute>
  );
}