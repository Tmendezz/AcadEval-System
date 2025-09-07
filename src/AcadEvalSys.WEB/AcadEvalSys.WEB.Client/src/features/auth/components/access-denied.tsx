import { UserRole, getFirstRoleLabel } from "@infrastructure/api/types/auth";

interface AccessDeniedProps {
  userRole?: UserRole | null;
  requiredRoles: UserRole[];
  title?: string;
  description?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

/**
 * Componente reutilizable para mostrar acceso denegado
 * Permite personalizar el mensaje y mostrar información detallada
 */
export function AccessDenied({
  userRole,
  requiredRoles,
  title = "Acceso Denegado",
  description = "No tienes permisos para acceder a esta página.",
  showBackButton = true,
  onBack,
}: AccessDeniedProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-destructive">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {userRole && (
            <p>
              <strong>Tu rol:</strong>{" "}
              {getFirstRoleLabel({ roles: [userRole] })}
            </p>
          )}
          <p>
            <strong>Roles requeridos:</strong>{" "}
            {requiredRoles
              .map((role) => getFirstRoleLabel({ roles: [role] }))
              .join(", ")}
          </p>
        </div>

        {showBackButton && (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Volver
          </button>
        )}
      </div>
    </div>
  );
}
