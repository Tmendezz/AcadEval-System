export const getErrorMessage = (error: any): string => {
  // Si hay un mensaje directo del error y no hay response, usarlo
  if (error?.message && typeof error.message === "string" && !error.response) {
    return error.message;
  }

  const status = error?.response?.status;
  const serverDetail = error?.response?.data?.detail;
  const serverTitle = error?.response?.data?.title;
  const serverMessage = error?.response?.data?.message;

  // Mapeo inteligente basado en status code + detail
  const getSpecificMessage = (statusCode: number, detail?: string): string => {
    switch (statusCode) {
      case 400:
        if (detail) {
          const detailMessages: Record<string, string> = {
            InvalidEmail: "El formato del correo electrónico no es válido.",
            InvalidPassword:
              "La contraseña no cumple con los requisitos de seguridad.",
            MissingFields: "Faltan campos obligatorios en la solicitud.",
            ValidationError: "Los datos enviados no son válidos.",
          };
          return (
            detailMessages[detail] || "Los datos ingresados no son válidos."
          );
        }
        return "Los datos ingresados no son válidos.";

      case 401:
        if (detail) {
          const detailMessages: Record<string, string> = {
            LockedOut:
              "Su cuenta ha sido bloqueada temporalmente por múltiples intentos fallidos. Contacte con un administrador.",
            NotAllowed:
              "Su cuenta no tiene permisos para iniciar sesión. Contacte con un administrador.",
            RequiresTwoFactor: "Se requiere autenticación de dos factores.",
            RequiresVerification:
              "Su cuenta requiere verificación. Revise su correo electrónico.",
            InvalidCredentials:
              "Credenciales incorrectas. Verifique su email y contraseña.",
            AccountLocked:
              "Su cuenta ha sido bloqueada. Contacte con un administrador.",
            AccountDisabled:
              "Su cuenta ha sido deshabilitada. Contacte con un administrador.",
            Failed:
              "Credenciales incorrectas. Verifique su email y contraseña.",
            ExpiredPassword: "Su contraseña ha expirado. Debe cambiarla.",
            AccountSuspended: "Su cuenta ha sido suspendida temporalmente.",
          };
          return (
            detailMessages[detail] ||
            "Credenciales incorrectas. Verifique su email y contraseña."
          );
        }
        return "Credenciales incorrectas. Verifique su email y contraseña.";

      case 403:
        if (detail) {
          const detailMessages: Record<string, string> = {
            InsufficientPermissions:
              "No tiene permisos suficientes para realizar esta acción.",
            RoleRequired:
              "Se requiere un rol específico para acceder a este recurso.",
            AccountRestricted:
              "Su cuenta tiene restricciones que impiden esta acción.",
            MaintenanceMode: "El sistema está en modo mantenimiento.",
          };
          return (
            detailMessages[detail] ||
            "No tiene permisos para realizar esta acción."
          );
        }
        return "No tiene permisos para realizar esta acción.";

      case 404:
        if (detail) {
          const detailMessages: Record<string, string> = {
            UserNotFound: "Usuario no encontrado en el sistema.",
            ResourceNotFound: "El recurso solicitado no existe.",
            FileNotFound: "El archivo solicitado no se encuentra.",
            EndpointNotFound: "La funcionalidad solicitada no está disponible.",
          };
          return detailMessages[detail] || "Recurso no encontrado.";
        }
        return "Recurso no encontrado.";

      case 409:
        if (detail) {
          const detailMessages: Record<string, string> = {
            DuplicateEmail: "Ya existe una cuenta con este correo electrónico.",
            DuplicateUsername: "El nombre de usuario ya está en uso.",
            ResourceExists: "El recurso ya existe en el sistema.",
            ConcurrentModification:
              "El recurso fue modificado por otro usuario.",
          };
          return detailMessages[detail] || "El recurso ya existe.";
        }
        return "El recurso ya existe.";

      case 422:
        if (detail) {
          const detailMessages: Record<string, string> = {
            ValidationError:
              "Los datos enviados no cumplen con las validaciones requeridas.",
            InvalidFormat: "El formato de los datos no es correcto.",
            MissingRequiredFields:
              "Faltan campos obligatorios en la solicitud.",
            InvalidDateRange: "El rango de fechas especificado no es válido.",
          };
          return detailMessages[detail] || "Error de validación en los datos.";
        }
        return "Error de validación en los datos.";

      case 429:
        return "Demasiados intentos. Espere un momento antes de intentar nuevamente.";

      case 500:
        if (detail) {
          const detailMessages: Record<string, string> = {
            DatabaseError:
              "Error en la base de datos. Intente nuevamente más tarde.",
            ExternalServiceError:
              "Error en un servicio externo. Intente nuevamente más tarde.",
            ConfigurationError: "Error de configuración del sistema.",
            InternalServerError:
              "Error interno del servidor. Contacte al administrador.",
          };
          return (
            detailMessages[detail] ||
            "Error interno del servidor. Intente nuevamente más tarde."
          );
        }
        return "Error interno del servidor. Intente nuevamente más tarde.";

      default:
        // Si no hay detail específico, usar el mensaje del servidor o uno genérico
        return (
          serverDetail ||
          serverTitle ||
          serverMessage ||
          "Error inesperado. Intente nuevamente."
        );
    }
  };

  // Obtener mensaje específico basado en status + detail
  if (status) {
    return getSpecificMessage(status, serverDetail);
  }

  // Fallback: usar mensaje del servidor si está disponible
  return (
    serverDetail ||
    serverTitle ||
    serverMessage ||
    "Error inesperado. Intente nuevamente."
  );
};
