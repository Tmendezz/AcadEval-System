import { z } from 'zod';
import { formatZodErrors, DEFAULT_ZOD_ERROR_MAPPINGS } from '@/shared/utils/zod-error-formatter';
import { ZodErrorMappings } from '@/shared/utils/zod-validation';
// Definir QuestionType localmente
type QuestionType = 'SingleChoice' | 'MultipleChoice' | 'OpenText';

// Esquema para opciones de pregunta
export const QuestionOptionSchema = z.object({
  text: z.string().min(1, 'El texto de la opción es obligatorio'),
  value: z.string().optional(),
  order: z.number().optional(),
  allowOpenText: z.boolean().optional(),
});

// Esquema para una pregunta individual
export const QuestionSchema = z.object({
  text: z.string().min(1, 'El texto de la pregunta es obligatorio'),
  type: z.enum(['SingleChoice', 'MultipleChoice', 'OpenText']),
  order: z.number().optional(),
  required: z.boolean().optional(),
  options: z.array(QuestionOptionSchema).optional(),
}).refine((data) => {
  // Validar que las preguntas de opción múltiple tengan al menos una opción
  if ((data.type === 'SingleChoice' || data.type === 'MultipleChoice')) {
    return data.options && data.options.length > 0;
  }
  return true;
}, {
  message: 'Las preguntas de opción múltiple deben tener al menos una opción',
  path: ['options'],
}).refine((data) => {
  // Validar que las preguntas de texto abierto no tengan opciones
  if (data.type === 'OpenText') {
    return !data.options || data.options.length === 0;
  }
  return true;
}, {
  message: 'Las preguntas de texto abierto no deben tener opciones',
  path: ['options'],
}).refine((data) => {
  // Validar que no haya opciones duplicadas
  if (data.options && data.options.length > 0) {
    const optionTexts = data.options.map(opt => opt.text.trim().toLowerCase());
    const uniqueTexts = new Set(optionTexts);
    return optionTexts.length === uniqueTexts.size;
  }
  return true;
}, {
  message: 'No puede haber opciones duplicadas',
  path: ['options'],
});

// Esquema para información básica de encuesta/plantilla
export const SurveyBasicInfoSchema = z.object({
  title: z.string()
    .min(1, 'El título es obligatorio')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(120, 'El título no puede exceder 120 caracteres'),
  description: z.string()
    .min(1, 'La descripción es obligatoria')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(300, 'La descripción no puede exceder 300 caracteres'),
});

// Esquema para información básica cuando se usa una plantilla (solo título)
export const SurveyTemplateBasicInfoSchema = z.object({
  title: z.string()
    .min(1, 'El título es obligatorio')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(120, 'El título no puede exceder 120 caracteres'),
});

// Esquema para validar todas las preguntas
export const SurveyQuestionsSchema = z.object({
  questions: z.array(QuestionSchema)
    .min(1, 'Debe agregar al menos una pregunta')
    .max(50, 'No puede haber más de 50 preguntas'),
});

// Esquema completo para encuesta
export const SurveyFormSchema = SurveyBasicInfoSchema.merge(SurveyQuestionsSchema);

// Esquema para plantilla de encuesta
export const SurveyTemplateFormSchema = z.object({
  title: z.string()
    .min(1, 'El título es obligatorio')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(120, 'El título no puede exceder 120 caracteres'),
  description: z.string()
    .min(1, 'La descripción es obligatoria')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(300, 'La descripción no puede exceder 300 caracteres'),
  surveyType: z.number().int().min(0).max(1),
  isDraft: z.boolean().optional(),
  questions: z.array(QuestionSchema)
    .min(1, 'Debe agregar al menos una pregunta')
    .max(50, 'No puede haber más de 50 preguntas'),
});

// Re-exportar el formateador de errores para mantener compatibilidad
// Ahora usa el sistema escalable de formateo de errores
export { formatZodErrors };

// Función helper para validar paso por paso
export function validateStep(step: number, data: any, isUsingTemplate: boolean = false, hasFixedQuestions: boolean = false): { isValid: boolean; errors: Record<string, string> } {
  try {
    switch (step) {
      case 0: // Información básica y preguntas
        const errors: Record<string, string> = {};
        
        // Usar mapeos para formatear errores correctamente
        const mappings = [ZodErrorMappings.questions];
        
        if (isUsingTemplate) {
          // Cuando se usa una plantilla, validar solo el título
          const basicInfoResult = SurveyTemplateBasicInfoSchema.safeParse({
            title: data.title,
          });
          if (!basicInfoResult.success) {
            Object.assign(errors, formatZodErrors(basicInfoResult.error, mappings));
          }
        } else {
          // Cuando no se usa plantilla, validar título y descripción
          const basicInfoResult = SurveyBasicInfoSchema.safeParse({
            title: data.title,
            description: data.description,
          });
          if (!basicInfoResult.success) {
            Object.assign(errors, formatZodErrors(basicInfoResult.error, mappings));
          }
        }
        
        // Siempre validar preguntas, ya que ahora son editables incluso cuando vienen de un template
        const questionsResult = SurveyQuestionsSchema.safeParse({
          questions: data.questions || [],
        });
        if (!questionsResult.success) {
          Object.assign(errors, formatZodErrors(questionsResult.error, mappings));
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors,
        };
        
      default:
        return { isValid: true, errors: {} };
    }
  } catch (error) {
    return {
      isValid: false,
      errors: { general: 'Error de validación inesperado' },
    };
  }
}
