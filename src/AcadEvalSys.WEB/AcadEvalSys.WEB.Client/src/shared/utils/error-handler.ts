/**
 * Manejo centralizado de errores de la aplicación
 * Transforma respuestas de error de la API en mensajes amigables para el usuario
 */

interface ErrorWithResponse {
  message?: string;
  response?: {
    status?: number;
    data?: {
      detail?: string;
      title?: string;
      message?: string;
    };
  };
}

/**
 * Mapeo de códigos de estado HTTP a mensajes por defecto
 */
const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: "Los datos ingresados no son válidos.",
  401: "Credenciales incorrectas. Verifique su email y contraseña.",
  403: "No tiene permisos para realizar esta acción.",
  404: "Recurso no encontrado.",
  409: "El recurso ya existe.",
  422: "Error de validación en los datos.",
  429: "Demasiados intentos. Espere un momento antes de intentar nuevamente.",
  500: "Error interno del servidor. Intente nuevamente más tarde.",
};

/**
 * Mapeo de códigos de detalle específicos a mensajes amigables
 * Organizados por código de estado HTTP
 */
const ERROR_DETAIL_MESSAGES: Record<number, Record<string, string>> = {
  // 400 - Bad Request
  400: {
    InvalidEmail: "El formato del correo electrónico no es válido.",
    InvalidPassword: "La contraseña no cumple con los requisitos de seguridad.",
    MissingFields: "Faltan campos obligatorios en la solicitud.",
    ValidationError: "Los datos enviados no son válidos.",
  },

  // 401 - Unauthorized
  401: {
    LockedOut: "Tu cuenta ha sido bloqueada temporalmente por múltiples intentos fallidos. Contacta al administrador para desbloquearla.",
    NotAllowed: "Tu cuenta no está habilitada. Contacta al administrador.",
    RequiresTwoFactor: "Se requiere autenticación de dos factores.",
    RequiresVerification: "Su cuenta requiere verificación. Revise su correo electrónico.",
    InvalidCredentials: "Correo electrónico o contraseña incorrectos. Verifica tus datos e intenta nuevamente.",
    AccountLocked: "Su cuenta ha sido bloqueada. Contacte con un administrador.",
    AccountDisabled: "Su cuenta ha sido deshabilitada. Contacte con un administrador.",
    Failed: "Correo electrónico o contraseña incorrectos. Verifica tus datos e intenta nuevamente.",
    ExpiredPassword: "Su contraseña ha expirado. Debe cambiarla.",
    AccountSuspended: "Su cuenta ha sido suspendida temporalmente.",
  },

  // 403 - Forbidden
  403: {
    InsufficientPermissions: "No tiene permisos suficientes para realizar esta acción.",
    RoleRequired: "Se requiere un rol específico para acceder a este recurso.",
    AccountRestricted: "Su cuenta tiene restricciones que impiden esta acción.",
    MaintenanceMode: "El sistema está en modo mantenimiento.",
  },

  // 404 - Not Found
  404: {
    UserNotFound: "Usuario no encontrado en el sistema.",
    ResourceNotFound: "El recurso solicitado no existe.",
    FileNotFound: "El archivo solicitado no se encuentra.",
    EndpointNotFound: "La funcionalidad solicitada no está disponible.",
  },

  // 409 - Conflict
  409: {
    DuplicateEmail: "Ya existe una cuenta con este correo electrónico.",
    DuplicateUsername: "El nombre de usuario ya está en uso.",
    ResourceExists: "El recurso ya existe en el sistema.",
    ConcurrentModification: "El recurso fue modificado por otro usuario.",
  },

  // 422 - Unprocessable Entity
  422: {
    ValidationError: "Los datos enviados no cumplen con las validaciones requeridas.",
    InvalidFormat: "El formato de los datos no es correcto.",
    MissingRequiredFields: "Faltan campos obligatorios en la solicitud.",
    InvalidDateRange: "El rango de fechas especificado no es válido.",
  },

  // 500 - Internal Server Error
  500: {
    DatabaseError: "Error en la base de datos. Intente nuevamente más tarde.",
    ExternalServiceError: "Error en un servicio externo. Intente nuevamente más tarde.",
    ConfigurationError: "Error de configuración del sistema.",
    InternalServerError: "Error interno del servidor. Contacte al administrador.",
  },
};

/**
 * Obtiene un mensaje específico basado en el código de estado y el detalle del error
 */
function getSpecificMessage(statusCode: number, detail?: string, serverMessage?: string, serverTitle?: string): string {
  // Si hay un detalle específico, buscar en el mapeo
  if (detail && ERROR_DETAIL_MESSAGES[statusCode]?.[detail]) {
    return ERROR_DETAIL_MESSAGES[statusCode][detail];
  }

  // Si no hay detalle pero hay un mensaje del servidor que es útil (no genérico), usarlo
  // Evitar usar títulos genéricos como "Unauthorized", "Bad Request", etc.
  const genericTitles = ["Unauthorized", "Bad Request", "Forbidden", "Not Found", "Conflict", "Internal Server Error"];
  const hasUsefulServerMessage = serverMessage && !genericTitles.includes(serverMessage);
  const hasUsefulServerTitle = serverTitle && !genericTitles.includes(serverTitle);
  
  if (hasUsefulServerMessage) {
    return serverMessage;
  }
  
  if (hasUsefulServerTitle && !hasUsefulServerMessage) {
    return serverTitle;
  }

  // Fallback al mensaje genérico del código de estado
  return HTTP_STATUS_MESSAGES[statusCode] || "Error inesperado. Intente nuevamente.";
}

/**
 * Extrae la información del error de diferentes estructuras posibles
 */
function extractErrorInfo(error: unknown): {
  status?: number;
  detail?: string;
  title?: string;
  message?: string;
  rawMessage?: string;
} {
  const err = error as ErrorWithResponse;

  return {
    status: err?.response?.status,
    detail: err?.response?.data?.detail,
    title: err?.response?.data?.title,
    message: err?.response?.data?.message,
    rawMessage: err?.message,
  };
}

/**
 * Función principal para obtener un mensaje de error amigable
 * 
 * @param error - El error capturado (puede ser de Axios, fetch, o cualquier otro)
 * @returns string - Mensaje de error amigable para mostrar al usuario
 * 
 * @example
 * ```ts
 * try {
 *   await api.post('/login', credentials);
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   toast.error(message);
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  const { status, detail, title, message, rawMessage } = extractErrorInfo(error);

  // Si hay un mensaje directo del error y no hay response, usarlo
  if (rawMessage && typeof rawMessage === "string" && !status) {
    return rawMessage;
  }

  // Si hay código de estado, obtener mensaje específico
  if (status) {
    return getSpecificMessage(status, detail, message, title);
  }

  // Fallback: usar cualquier mensaje disponible o uno genérico
  return detail || title || message || rawMessage || "Error inesperado. Intente nuevamente.";
}

/**
 * Verifica si un error es de un tipo específico basado en el código de estado
 */
export function isErrorType(error: unknown, statusCode: number): boolean {
  const { status } = extractErrorInfo(error);
  return status === statusCode;
}

/**
 * Verifica si un error tiene un detalle específico
 */
export function hasErrorDetail(error: unknown, detailCode: string): boolean {
  const { detail } = extractErrorInfo(error);
  return detail === detailCode;
}

/**
 * Obtiene información completa del error para logging o debugging
 */
export function getErrorInfo(error: unknown) {
  return extractErrorInfo(error);
}
