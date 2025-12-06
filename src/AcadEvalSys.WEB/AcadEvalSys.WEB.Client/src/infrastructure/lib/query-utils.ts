/**
 * Query Utilities - Abstracciones para TanStack Query
 *
 * Este módulo proporciona wrappers y utilidades para estandarizar
 * el uso de React Query en toda la aplicación.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
  type QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

// ============================================
// TIPOS
// ============================================

export interface MutationMessages {
  success?: string;
  error?: string;
  loading?: string;
}

export interface OptimisticMutationOptions<TData, TVariables, TContext = unknown>
  extends Omit<
    UseMutationOptions<TData, AxiosError, TVariables, TContext>,
    "onSuccess" | "onError"
  > {
  /** Mensajes para los toasts */
  messages?: MutationMessages;
  /** Query keys a invalidar en caso de éxito */
  invalidateKeys?: QueryKey[];
  /** Callback adicional en caso de éxito */
  onSuccessCallback?: (data: TData, variables: TVariables) => void | Promise<void>;
  /** Callback adicional en caso de error */
  onErrorCallback?: (error: AxiosError, variables: TVariables) => void;
  /** Si debe mostrar toast de éxito (default: true) */
  showSuccessToast?: boolean;
  /** Si debe mostrar toast de error (default: true) */
  showErrorToast?: boolean;
}

export interface StaleQueryOptions<TData>
  extends Omit<UseQueryOptions<TData, AxiosError, TData, QueryKey>, "queryKey" | "queryFn"> {
  /** Tiempo de stale en minutos (default: 5) */
  staleMinutes?: number;
}

// ============================================
// FACTORY DE QUERY KEYS
// ============================================

/**
 * Crea un objeto de query keys estandarizado para una entidad
 *
 * @example
 * const professorKeys = createQueryKeys('professors');
 * // professorKeys.all => ['professors']
 * // professorKeys.lists() => ['professors', 'list']
 * // professorKeys.list({ page: 1 }) => ['professors', 'list', { page: 1 }]
 * // professorKeys.details() => ['professors', 'detail']
 * // professorKeys.detail('123') => ['professors', 'detail', '123']
 */
export function createQueryKeys<T extends string>(entity: T) {
  return {
    all: [entity] as const,
    lists: () => [...[entity], "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      filters
        ? ([...[entity], "list", filters] as const)
        : ([...[entity], "list"] as const),
    details: () => [...[entity], "detail"] as const,
    detail: (id: string) => [...[entity], "detail", id] as const,
  };
}

// ============================================
// HOOK: useOptimisticMutation
// ============================================

/**
 * Hook wrapper para useMutation que estandariza:
 * - Toasts de éxito/error
 * - Invalidación de queries
 * - Manejo de errores de Axios
 *
 * @example
 * const createProfessor = useOptimisticMutation({
 *   mutationFn: (data) => professorService.create(data),
 *   messages: {
 *     success: 'Profesor creado exitosamente',
 *     error: 'Error al crear el profesor',
 *   },
 *   invalidateKeys: [['professors']],
 * });
 */
export function useOptimisticMutation<TData = unknown, TVariables = void>({
  mutationFn,
  messages = {},
  invalidateKeys = [],
  onSuccessCallback,
  onErrorCallback,
  showSuccessToast = true,
  showErrorToast = true,
  ...options
}: OptimisticMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn,
    onSuccess: async (data, variables) => {
      // Invalidar queries especificadas
      await Promise.all(
        invalidateKeys.map((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        )
      );

      // Mostrar toast de éxito
      if (showSuccessToast && messages.success) {
        toast.success(messages.success);
      }

      // Ejecutar callback adicional
      if (onSuccessCallback) {
        await onSuccessCallback(data, variables);
      }
    },
    onError: (error, variables) => {
      // Mostrar toast de error
      if (showErrorToast) {
        const serverMessage = extractErrorMessage(error);
        toast.error(messages.error || serverMessage || "Ha ocurrido un error");
      }

      // Ejecutar callback adicional
      if (onErrorCallback) {
        onErrorCallback(error, variables);
      }
    },
    ...options,
  });
}

// ============================================
// HOOK: useStaleQuery
// ============================================

/**
 * Hook wrapper para useQuery con configuración de staleTime por defecto
 *
 * @example
 * const { data } = useStaleQuery({
 *   queryKey: professorKeys.lists(),
 *   queryFn: () => professorService.getAll(),
 *   staleMinutes: 10,
 * });
 */
export function useStaleQuery<TData = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options?: StaleQueryOptions<TData>
) {
  const { staleMinutes = 5, ...restOptions } = options || {};

  return useQuery<TData, AxiosError, TData, QueryKey>({
    queryKey,
    queryFn,
    staleTime: staleMinutes * 60 * 1000,
    ...restOptions,
  });
}

// ============================================
// HOOK: useEntityQuery
// ============================================

/**
 * Hook para queries de entidad por ID con enabled automático
 *
 * @example
 * const { data: professor } = useEntityQuery(
 *   professorKeys.detail(id),
 *   () => professorService.getById(id),
 *   id
 * );
 */
export function useEntityQuery<TData = unknown>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  entityId?: string | null,
  options?: StaleQueryOptions<TData>
) {
  const { staleMinutes = 5, ...restOptions } = options || {};

  return useQuery<TData, AxiosError, TData, QueryKey>({
    queryKey,
    queryFn,
    enabled: !!entityId,
    staleTime: staleMinutes * 60 * 1000,
    ...restOptions,
  });
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Extrae el mensaje de error de una respuesta de Axios
 */
export function extractErrorMessage(error: AxiosError): string {
  const data = error.response?.data as
    | { Message?: string; message?: string; errors?: Record<string, string[]> }
    | undefined;

  // Intentar obtener errores de validación de FluentValidation
  if (data?.errors) {
    const errorMessages = Object.values(data.errors).flat();
    if (errorMessages.length > 0) {
      return errorMessages[0];
    }
  }

  // Mensaje del servidor
  if (data?.Message) return data.Message;
  if (data?.message) return data.message;

  // Mensaje de Axios
  if (error.message) return error.message;

  return "Ha ocurrido un error inesperado";
}

/**
 * Extrae todos los mensajes de error de una respuesta de Axios
 */
export function extractAllErrorMessages(error: AxiosError): string[] {
  const data = error.response?.data as
    | { Message?: string; message?: string; errors?: Record<string, string[]> }
    | undefined;

  const messages: string[] = [];

  // Errores de validación
  if (data?.errors) {
    messages.push(...Object.values(data.errors).flat());
  }

  // Mensaje del servidor
  if (data?.Message) messages.push(data.Message);
  else if (data?.message) messages.push(data.message);

  // Si no hay mensajes, usar el de Axios
  if (messages.length === 0 && error.message) {
    messages.push(error.message);
  }

  return messages.length > 0 ? messages : ["Ha ocurrido un error inesperado"];
}

