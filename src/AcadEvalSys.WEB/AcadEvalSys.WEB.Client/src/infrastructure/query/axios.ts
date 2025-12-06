import axios, { type AxiosRequestConfig } from "axios";
import { navigate } from "wouter/use-browser-location";
import { toast } from "sonner";

// ============================================
// INSTANCIA BASE DE AXIOS
// ============================================

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const currentPath = window.location.pathname;
    const isAuthRoute = currentPath.startsWith("/auth");
    const isLoginEndpoint = error.config?.url?.includes("/login");

    if (error.response?.status === 401 && !isAuthRoute && !isLoginEndpoint) {
      try {
        const { useAuthStore } = await import("@/features/auth/store");
        useAuthStore.getState().logout();
      } catch (e) {
        console.warn("Could not clear auth store:", e);
      }

      navigate("/auth/login");

      toast.warning("Su sesión ha expirado. Inicie sesión nuevamente.");

      return Promise.reject(
        new Error("Su sesión ha expirado. Inicie sesión nuevamente.")
      );
    }

    if (error.response?.status === 403) {
      const message = "No tiene permisos para realizar esta acción.";

      toast.error(message);
      console.warn("Access forbidden:", error.config?.url);
      return Promise.reject(new Error(message));
    }

    if (error.response?.status === 429) {
      const message =
        "Demasiados intentos. Espere un momento antes de intentar nuevamente.";

      toast.warning(message);
      return Promise.reject(new Error(message));
    }

    if (error.response?.status >= 500) {
      const message = "Error del servidor. Intente nuevamente más tarde.";

      toast.error(message);
      console.error("Server error:", error.config?.url, error.response?.status);
      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  }
);

// ============================================
// TIPOS PARA FACTORY CRUD
// ============================================

/** Respuesta paginada estándar del backend */
export interface PagedResult<T> {
  items: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

/** Parámetros de paginación */
export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}

/** Respuesta de creación del backend */
interface CreateResponse {
  id: string;
}

// ============================================
// FACTORY DE SERVICIOS CRUD
// ============================================

/**
 * Crea un servicio CRUD completo para una entidad
 *
 * @example
 * // Servicio básico
 * const careerService = createCrudService<Career, CreateCareerDto, UpdateCareerDto>('/technical-careers');
 *
 * // Uso
 * const careers = await careerService.getAll();
 * const career = await careerService.getById('123');
 * const id = await careerService.create({ name: 'Nueva Carrera' });
 * await careerService.update('123', { name: 'Actualizada' });
 * await careerService.remove('123');
 */
export function createCrudService<
  TEntity,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>
>(baseUrl: string) {
  return {
    /** Obtiene todas las entidades */
    async getAll(config?: AxiosRequestConfig): Promise<TEntity[]> {
      const { data } = await api.get<TEntity[]>(baseUrl, config);
      return data;
    },

    /** Obtiene entidades con paginación */
    async getPaged(
      params?: PaginationParams & Record<string, unknown>
    ): Promise<PagedResult<TEntity>> {
      const { data } = await api.get<PagedResult<TEntity>>(baseUrl, { params });
      return data;
    },

    /** Obtiene una entidad por ID */
    async getById(id: string): Promise<TEntity> {
      const { data } = await api.get<TEntity>(`${baseUrl}/${id}`);
      return data;
    },

    /** Crea una nueva entidad y retorna su ID */
    async create(body: TCreate): Promise<string> {
      const { data } = await api.post<CreateResponse>(baseUrl, body);
      return data.id;
    },

    /** Actualiza una entidad existente */
    async update(id: string, body: TUpdate): Promise<void> {
      await api.put(`${baseUrl}/${id}`, body);
    },

    /** Elimina una entidad */
    async remove(id: string): Promise<void> {
      await api.delete(`${baseUrl}/${id}`);
    },
  };
}

/**
 * Crea un servicio CRUD anidado (ej: /careers/:careerId/subjects)
 *
 * @example
 * const subjectService = createNestedCrudService<Subject, CreateSubject>('/technical-careers', 'subjects');
 *
 * // Uso
 * const subjects = await subjectService.getAll('career-123');
 * const id = await subjectService.create('career-123', { name: 'Matemáticas' });
 */
export function createNestedCrudService<
  TEntity,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TEntity>
>(parentUrl: string, childResource: string) {
  const buildUrl = (parentId: string, childId?: string) =>
    childId
      ? `${parentUrl}/${parentId}/${childResource}/${childId}`
      : `${parentUrl}/${parentId}/${childResource}`;

  return {
    /** Obtiene todos los recursos hijos */
    async getAll(parentId: string): Promise<TEntity[]> {
      const { data } = await api.get<TEntity[]>(buildUrl(parentId));
      return data;
    },

    /** Obtiene un recurso hijo por ID */
    async getById(parentId: string, childId: string): Promise<TEntity> {
      const { data } = await api.get<TEntity>(buildUrl(parentId, childId));
      return data;
    },

    /** Crea un nuevo recurso hijo */
    async create(parentId: string, body: TCreate): Promise<string> {
      const { data } = await api.post<CreateResponse>(buildUrl(parentId), body);
      return data.id;
    },

    /** Actualiza un recurso hijo */
    async update(parentId: string, childId: string, body: TUpdate): Promise<void> {
      await api.put(buildUrl(parentId, childId), body);
    },

    /** Elimina un recurso hijo */
    async remove(parentId: string, childId: string): Promise<void> {
      await api.delete(buildUrl(parentId, childId));
    },
  };
}

// ============================================
// HELPERS PARA REQUESTS ESPECÍFICOS
// ============================================

/**
 * Helper para subir archivos con FormData
 */
export async function uploadFile<TResponse>(
  url: string,
  file: File,
  fieldName = "file"
): Promise<TResponse> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const { data } = await api.post<TResponse>(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

/**
 * Helper para descargar archivos como blob
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  const { data } = await api.get(url, { responseType: "blob" });

  const blob = new Blob([data]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

export { api };
