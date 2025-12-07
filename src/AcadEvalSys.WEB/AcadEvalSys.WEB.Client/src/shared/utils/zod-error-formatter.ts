import { z } from 'zod';

/**
 * Configuración de mapeo de paths de Zod a formatos de UI
 * Permite definir cómo se transforman los paths de errores de Zod
 * a los formatos esperados por los componentes de UI
 */
export interface ZodErrorPathMapping {
  /**
   * Nombre del campo raíz (ej: 'questions', 'items', etc.)
   */
  rootField: string;
  /**
   * Formato de transformación para elementos del array
   * {index} será reemplazado por el índice del elemento
   * {field} será reemplazado por el campo anidado
   * 
   * Ejemplo: 'question_{index}_{field}' -> 'question_0_text'
   */
  arrayItemFormat?: string;
  /**
   * Si es true, los campos anidados se unen con el separador
   * Si es false, solo se usa el último campo
   */
  joinNestedFields?: boolean;
  /**
   * Separador para campos anidados (default: '_')
   */
  nestedFieldSeparator?: string;
}

/**
 * Configuración por defecto para mapeos comunes
 */
export const DEFAULT_ZOD_ERROR_MAPPINGS: ZodErrorPathMapping[] = [
  {
    rootField: 'questions',
    arrayItemFormat: 'question_{index}_{field}',
    joinNestedFields: true,
    nestedFieldSeparator: '_',
  },
  {
    rootField: 'items',
    arrayItemFormat: 'item_{index}_{field}',
    joinNestedFields: true,
    nestedFieldSeparator: '_',
  },
  {
    rootField: 'options',
    arrayItemFormat: 'option_{index}_{field}',
    joinNestedFields: true,
    nestedFieldSeparator: '_',
  },
];

/**
 * Formatea errores de Zod a un formato compatible con componentes de UI
 * 
 * @param error - Error de Zod a formatear
 * @param mappings - Configuración de mapeo de paths (opcional, usa defaults si no se proporciona)
 * @returns Objeto con los errores formateados donde las keys son los paths de UI
 * 
 * @example
 * ```ts
 * // Error de Zod: { path: ['questions', 0, 'text'], message: 'Required' }
 * // Resultado: { 'question_0_text': 'Required' }
 * 
 * // Error de Zod: { path: ['title'], message: 'Required' }
 * // Resultado: { 'title': 'Required' }
 * ```
 */
export function formatZodErrors(
  error: z.ZodError,
  mappings: ZodErrorPathMapping[] = DEFAULT_ZOD_ERROR_MAPPINGS
): Record<string, string> {
  const errors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path;
    
    if (path.length === 0) {
      // Error general sin path específico
      errors.general = err.message;
      return;
    }

    // Buscar si hay un mapeo configurado para el campo raíz
    const rootField = path[0];
    const mapping = mappings.find(m => m.rootField === rootField);

    if (mapping && path.length > 1 && typeof path[1] === 'number') {
      // Es un array con mapeo configurado
      const index = path[1];
      const nestedPath = path.slice(2);
      
      if (mapping.arrayItemFormat) {
        // Formatear según el patrón configurado
        const field = mapping.joinNestedFields
          ? nestedPath.map(String).join(mapping.nestedFieldSeparator || '_')
          : String(nestedPath[nestedPath.length - 1] || '');
        
        let errorKey = mapping.arrayItemFormat;
        errorKey = errorKey.replace(/{index}/g, String(index));
        errorKey = errorKey.replace(/{field}/g, String(field));
        
        errors[errorKey] = err.message;
      } else {
        // Sin formato específico, usar formato genérico
        const field = nestedPath.join('_');
        errors[`${rootField}_${index}_${field}`] = err.message;
      }
    } else if (mapping && path.length === 1) {
      // Error en el array en general (no en un elemento específico)
      errors[rootField] = err.message;
    } else {
      // Campo simple o sin mapeo configurado
      // Usar el path completo unido con puntos o el último elemento
      const fieldPath = path.join('.');
      errors[fieldPath] = err.message;
    }
  });

  return errors;
}

/**
 * Crea un mapeo personalizado para un campo específico
 * Útil para casos especiales que no están en los defaults
 * 
 * @example
 * ```ts
 * const customMapping = createZodErrorMapping('products', 'product_{index}_{field}');
 * const errors = formatZodErrors(zodError, [customMapping, ...DEFAULT_ZOD_ERROR_MAPPINGS]);
 * ```
 */
export function createZodErrorMapping(
  rootField: string,
  arrayItemFormat?: string,
  options?: {
    joinNestedFields?: boolean;
    nestedFieldSeparator?: string;
  }
): ZodErrorPathMapping {
  return {
    rootField,
    arrayItemFormat,
    joinNestedFields: options?.joinNestedFields ?? true,
    nestedFieldSeparator: options?.nestedFieldSeparator ?? '_',
  };
}

