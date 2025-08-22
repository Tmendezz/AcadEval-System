import { useAuthStore } from "../store";
import { UserRole, hasAnyRole } from "@/shared/types/auth";

// Hook simple para verificar permisos
export function usePermissions() {
  const { user, isAuthenticated } = useAuthStore();

  const can = (requiredRoles: UserRole[] | UserRole): boolean => {
    if (!isAuthenticated || !user) return false;

    if (Array.isArray(requiredRoles)) {
      return hasAnyRole(user, requiredRoles);
    }

    return user.roles.includes(requiredRoles);
  };

  const isRole = (role: UserRole): boolean => {
    return isAuthenticated && user ? user.roles.includes(role) : false;
  };

  return {
    can,
    isRole,
    isAdmin: () => isRole(UserRole.Admin),
    isCoordinator: () => isRole(UserRole.Coordinator),
    isProfessor: () => isRole(UserRole.Professor),
    isStudent: () => isRole(UserRole.Student),
    user,
    isAuthenticated,
  };
}

// Hook específico para evaluaciones
export function useCanEvaluate() {
  const { can } = usePermissions();

  return {
    canEvaluate: can([
      UserRole.Admin,
      UserRole.Coordinator,
      UserRole.Professor,
    ]),
    canViewEvaluations: can([
      UserRole.Admin,
      UserRole.Coordinator,
      UserRole.Professor,
      UserRole.Student,
    ]),
    canManageEvaluations: can([UserRole.Admin, UserRole.Coordinator]),
  };
}
