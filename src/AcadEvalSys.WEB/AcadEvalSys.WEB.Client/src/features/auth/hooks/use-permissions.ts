import { useMemo, useCallback } from "react";
import { useAuthStore } from "../store";
import { UserRole, hasAnyRole } from "../models";

/**
 * Hook para verificar permisos del usuario autenticado
 * Memoiza los valores para evitar re-renders innecesarios
 */
export function usePermissions() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Memoizar función can para estabilidad referencial
  const can = useCallback(
    (requiredRoles: UserRole[] | UserRole): boolean => {
      if (!isAuthenticated || !user) return false;

      if (Array.isArray(requiredRoles)) {
        return hasAnyRole(user, requiredRoles);
      }

      return user.roles.includes(requiredRoles);
    },
    [isAuthenticated, user]
  );

  // Memoizar roles como valores booleanos (no funciones)
  const permissions = useMemo(() => {
    const userRoles = user?.roles ?? [];

    return {
      isAdmin: userRoles.includes(UserRole.Admin),
      isCoordinator: userRoles.includes(UserRole.Coordinator),
      isProfessor: userRoles.includes(UserRole.Professor),
      isStudent: userRoles.includes(UserRole.Student),
    };
  }, [user?.roles]);

  return {
    can,
    ...permissions,
    user,
    isAuthenticated,
  };
}

/**
 * Hook específico para permisos de evaluaciones
 * Memoiza todos los permisos para evitar recálculos
 */
export function useCanEvaluate() {
  const { isAdmin, isCoordinator, isProfessor, isStudent, isAuthenticated } =
    usePermissions();

  return useMemo(
    () => ({
      canEvaluate: isAdmin || isCoordinator || isProfessor,
      canViewEvaluations: isAdmin || isCoordinator || isProfessor || isStudent,
      canManageEvaluations: isAdmin || isCoordinator,
    }),
    [isAdmin, isCoordinator, isProfessor, isStudent]
  );
}
