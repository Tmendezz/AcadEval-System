export const getErrorMessage = (error: any): string => {
  if (error?.message && typeof error.message === "string" && !error.response) {
    return error.message;
  }

  const status = error?.response?.status;
  const serverMessage =
    error?.response?.data?.message || error?.response?.data?.title;
  console.log("error:", error);
  switch (status) {
    case 400:
      return serverMessage || "Los datos ingresados no son válidos.";
    case 401:
      return "Credenciales incorrectas. Intente nuevamente.";
    case 403:
      return "No tiene permisos para realizar esta acción.";
    case 404:
      return "Recurso no encontrado.";
    case 409:
      return "El recurso ya existe.";
    case 422:
      return serverMessage || "Error de validación en los datos.";
    case 429:
      return "Demasiados intentos. Espere un momento antes de intentar nuevamente.";
    case 500:
      return "Error interno del servidor. Intente nuevamente más tarde.";
    default:
      return serverMessage || "Error inesperado. Intente nuevamente.";
  }
};
