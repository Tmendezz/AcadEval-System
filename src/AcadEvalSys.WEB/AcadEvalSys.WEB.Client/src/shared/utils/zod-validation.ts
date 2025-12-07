import { z } from 'zod';
import { formatZodErrors, createZodErrorMapping, DEFAULT_ZOD_ERROR_MAPPINGS, type ZodErrorPathMapping } from './zod-error-formatter';

/**
 * Resultado de una validación con Zod
 */
export interface ZodValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Opciones para la función de validación
 */
export interface ZodValidationOptions {
  /**
   * Mapeos personalizados para formatear paths de errores
   * Si no se proporciona, se usan los mapeos por defecto
   */
  mappings?: ZodErrorPathMapping[];
  /**
   * Si es true, retorna errores vacíos en lugar de lanzar excepción
   * Si es false, lanza la excepción de Zod si la validación falla
   */
  safe?: boolean;
}

/**
 * Valida datos contra un schema de Zod y retorna errores formateados
 * 
 * @param schema - Schema de Zod para validar
 * @param data - Datos a validar
 * @param options - Opciones de validación
 * @returns Resultado de la validación con errores formateados
 * 
 * @example
 * ```ts
 * const result = validateZodSchema(mySchema, formData);
 * if (!result.isValid) {
 *   setErrors(result.errors);
 * }
 * ```
 */
export function validateZodSchema<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  options: ZodValidationOptions = {}
): ZodValidationResult {
  const { mappings, safe = true } = options;
  
  try {
    if (safe) {
      const result = schema.safeParse(data);
      if (result.success) {
        return { isValid: true, errors: {} };
      }
      
      const errors = formatZodErrors(result.error, mappings);
      return { isValid: false, errors };
    } else {
      // Usar parse directo (lanzará excepción si falla)
      schema.parse(data);
      return { isValid: true, errors: {} };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = formatZodErrors(error, mappings);
      return { isValid: false, errors };
    }
    throw error;
  }
}

/**
 * Valida un campo específico de un schema
 * Útil para validación en tiempo real de campos individuales
 * 
 * @param schema - Schema de Zod
 * @param fieldPath - Path del campo a validar (ej: 'title', 'questions.0.text')
 * @param data - Datos completos del formulario
 * @param options - Opciones de validación
 * @returns Error del campo específico o null si es válido
 * 
 * @example
 * ```ts
 * const titleError = validateZodField(mySchema, 'title', formData);
 * // Retorna: 'El título es obligatorio' o null
 * ```
 */
export function validateZodField<T extends z.ZodTypeAny>(
  schema: T,
  fieldPath: string,
  data: unknown,
  options: ZodValidationOptions = {}
): string | null {
  const result = validateZodSchema(schema, data, options);
  return result.errors[fieldPath] || null;
}

/**
 * Crea un hook de validación en tiempo real para formularios
 * Retorna funciones para validar el formulario completo o campos individuales
 * 
 * @param schema - Schema de Zod
 * @param mappings - Mapeos personalizados para errores (opcional)
 * @returns Funciones de validación
 * 
 * @example
 * ```ts
 * const { validate, validateField, errors } = useZodValidation(mySchema);
 * 
 * // Validar todo el formulario
 * const result = validate(formData);
 * 
 * // Validar un campo específico
 * const fieldError = validateField('title', formData);
 * ```
 */
export function createZodValidator<T extends z.ZodTypeAny>(
  schema: T,
  mappings?: ZodErrorPathMapping[]
) {
  return {
    /**
     * Valida el formulario completo
     */
    validate: (data: unknown): ZodValidationResult => {
      return validateZodSchema(schema, data, { mappings, safe: true });
    },
    
    /**
     * Valida un campo específico
     */
    validateField: (fieldPath: string, data: unknown): string | null => {
      return validateZodField(schema, fieldPath, data, { mappings, safe: true });
    },
    
    /**
     * Valida y retorna solo si es válido (útil para submit)
     */
    validateForSubmit: (data: unknown): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> } => {
      const result = validateZodSchema(schema, data, { mappings, safe: true });
      if (result.isValid) {
        const parsed = schema.parse(data);
        return { success: true, data: parsed };
      }
      return { success: false, errors: result.errors };
    },
  };
}

/**
 * Helper para crear mapeos comunes de forma rápida
 */
export const ZodErrorMappings = {
  /**
   * Mapeo para arrays de preguntas (questions.0.text -> question_0_text)
   */
  questions: createZodErrorMapping('questions', 'question_{index}_{field}'),
  
  /**
   * Mapeo para arrays de items genéricos
   */
  items: createZodErrorMapping('items', 'item_{index}_{field}'),
  
  /**
   * Mapeo para arrays de opciones
   */
  options: createZodErrorMapping('options', 'option_{index}_{field}'),
  
  /**
   * Mapeo para arrays de asignaciones
   */
  assignments: createZodErrorMapping('assignments', 'assignment_{index}_{field}'),
  
  /**
   * Mapeo para arrays de competencias
   */
  competencies: createZodErrorMapping('competencies', 'competency_{index}_{field}'),
  
  /**
   * Mapeo para niveles de competencia (levels.Inicial -> levels_Inicial)
   */
  levels: createZodErrorMapping('levels', 'level_{field}', {
    joinNestedFields: false,
  }),
  
  /**
   * Mapeo para asignaciones de competencias en evaluaciones
   */
  competencyAssignments: createZodErrorMapping('competencyAssignments', 'assignment_{index}_{field}'),
};

