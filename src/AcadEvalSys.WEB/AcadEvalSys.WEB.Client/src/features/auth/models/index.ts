// Tipos y utilidades del módulo de autenticación

export enum UserRole {
  Admin = "Admin",
  Coordinator = "Coordinator",
  Professor = "Professor",
  Student = "Student",
}

export type User = {
  id: string;
  email: string;
  userName?: string | null;
  name?: string | null;
  roles: UserRole[];
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SessionStatus = {
  isAuthenticated: boolean;
  user?: User | null;
  expiresAt?: string | null;
  minutesRemaining?: number | null;
};

export function hasAnyRole(user: User, roles: UserRole[]): boolean {
  if (!user || !Array.isArray(user.roles)) return false;
  return user.roles.some((role) => roles.includes(role));
}

export function getFirstRole(user: User): UserRole | null {
  if (!user || !user.roles || user.roles.length === 0) return null;
  return user.roles[0] ?? null;
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [UserRole.Admin]: "Administrador",
    [UserRole.Coordinator]: "Coordinador",
    [UserRole.Professor]: "Profesor",
    [UserRole.Student]: "Estudiante",
  };
  return labels[role];
}

export function getFirstRoleLabel(user: User): string {
  const role = getFirstRole(user);
  return role ? getRoleLabel(role) : "Sin rol";
}


