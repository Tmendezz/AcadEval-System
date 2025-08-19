export enum UserRole {
  Admin = "Admin",
  Student = "Student", 
  Professor = "Professor",
  Coordinator = "Coordinator"
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export interface SessionStatus {
  isAuthenticated: boolean;
  user?: User;
  expiresAt?: string;
  minutesRemaining?: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Helper para verificar roles
export const USER_ROLES: Record<UserRole, string> = {
  [UserRole.Admin]: 'Administrador',
  [UserRole.Coordinator]: 'Coordinador', 
  [UserRole.Professor]: 'Profesor',
  [UserRole.Student]: 'Estudiante',
} as const;

// Funciones de utilidad para roles
export function getRoleLabel(role: UserRole): string {
  return USER_ROLES[role] || role;
}

export function isValidRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}

// Funciones para manejar arrays de roles
export function getFirstRole(user: User): UserRole {
  return user.roles[0] || UserRole.Student;
}

export function getFirstRoleLabel(user: User): string {
  return getRoleLabel(getFirstRole(user));
}

export function hasRole(user: User, requiredRole: UserRole): boolean {
  return user.roles.includes(requiredRole);
}

export function hasAnyRole(user: User, requiredRoles: UserRole[]): boolean {
  return user.roles.some(role => requiredRoles.includes(role));
} 