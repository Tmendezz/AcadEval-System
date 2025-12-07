import { useState, useCallback, useMemo, useEffect } from 'react';
import { z } from 'zod';
import { validateZodSchema, validateZodField, type ZodValidationOptions } from '../utils/zod-validation';

/**
 * Hook para validación en tiempo real con Zod
 * 
 * @param schema - Schema de Zod para validar
 * @param initialData - Datos iniciales del formulario
 * @param options - Opciones de validación
 * @returns Objeto con errores, funciones de validación y estado
 * 
 * @example
 * ```tsx
 * const { errors, validate, validateField, isValid } = useZodValidation(
 *   mySchema,
 *   formData
 * );
 * 
 * // Validar en tiempo real cuando cambia un campo
 * useEffect(() => {
 *   validate(formData);
 * }, [formData]);
 * ```
 */
export function useZodValidation<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  options: ZodValidationOptions = {}
) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validar cuando cambian los datos
  useEffect(() => {
    const result = validateZodSchema(schema, data, options);
    setErrors(result.errors);
  }, [schema, data, options]);

  const validate = useCallback((formData: unknown) => {
    const result = validateZodSchema(schema, formData, options);
    setErrors(result.errors);
    return result;
  }, [schema, options]);

  const validateField = useCallback((fieldPath: string, formData: unknown) => {
    const error = validateZodField(schema, fieldPath, formData, options);
    if (error) {
      setErrors(prev => ({ ...prev, [fieldPath]: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldPath];
        return newErrors;
      });
    }
    return error;
  }, [schema, options]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldPath: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldPath];
      return newErrors;
    });
  }, []);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    errors,
    isValid,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
  };
}


