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
// Alineado con el backend: título entre 5 y 200 caracteres, descripción máximo 500
export const SurveyBasicInfoSchema = z.object({
  title: z.string()
    .min(1, 'El título es obligatorio')
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  description: z.string()
    .min(1, 'La descripción es obligatoria')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
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

// Esquema para validar las fechas de programación
export const SurveySchedulingSchema = z.object({
  publishAt: z.string()
    .min(1, 'La fecha de publicación es obligatoria')
    .refine((val) => val.trim().length > 0, {
      message: 'La fecha de publicación es obligatoria',
    }),
  closeAt: z.string()
    .min(1, 'La fecha de cierre es obligatoria')
    .refine((val) => val.trim().length > 0, {
      message: 'La fecha de cierre es obligatoria',
    }),
}).refine((data) => {
  if (data.publishAt && data.closeAt && data.publishAt.trim() && data.closeAt.trim()) {
    const publishDate = new Date(data.publishAt);
    const closeDate = new Date(data.closeAt);
    return closeDate > publishDate;
  }
  return true;
}, {
  message: 'La fecha de cierre debe ser posterior a la fecha de publicación',
  path: ['closeAt'],
});

// Re-exportar el formateador de errores para mantener compatibilidad
// Ahora usa el sistema escalable de formateo de errores
export { formatZodErrors };

// Función helper para validar paso por paso
export function validateStep(
  step: number, 
  data: any, 
  isUsingTemplate: boolean = false, 
  hasFixedQuestions: boolean = false,
  scheduling?: { publishAt?: string; closeAt?: string },
  settings?: { selectedCareerIds?: string[]; selectedYears?: any[] }
): { isValid: boolean; errors: Record<string, string> } {
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
      
      case 1: // Configuración (fechas de programación y audiencia)
        const schedulingErrors: Record<string, string> = {};
        
        const publishAtValue = scheduling?.publishAt?.trim() || '';
        const closeAtValue = scheduling?.closeAt?.trim() || '';
        
        if (!publishAtValue) {
          schedulingErrors.publishAt = 'La fecha de publicación es obligatoria';
        }
        
        if (!closeAtValue) {
          schedulingErrors.closeAt = 'La fecha de cierre es obligatoria';
        }
        
        // Validar que la fecha de publicación sea >= hoy
        if (publishAtValue) {
          const publishDate = new Date(publishAtValue);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (publishDate < today) {
            schedulingErrors.publishAt = 'La fecha de publicación no puede ser anterior a hoy';
          }
        }
        
        // Validar que la fecha de cierre sea > fecha de publicación y >= hoy
        if (closeAtValue) {
          const closeDate = new Date(closeAtValue);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (closeDate < today) {
            schedulingErrors.closeAt = 'La fecha de cierre no puede ser anterior a hoy';
          }
          if (publishAtValue) {
            const publishDate = new Date(publishAtValue);
            if (closeDate <= publishDate) {
              schedulingErrors.closeAt = 'La fecha de cierre debe ser posterior a la fecha de publicación';
            }
          }
        }
        
        // Solo validar la relación entre fechas si ambas están presentes
        if (publishAtValue && closeAtValue) {
          const schedulingResult = SurveySchedulingSchema.safeParse({
            publishAt: publishAtValue,
            closeAt: closeAtValue,
          });
          
          if (!schedulingResult.success) {
            Object.assign(schedulingErrors, formatZodErrors(schedulingResult.error, mappings));
          }
        }
        
        return {
          isValid: Object.keys(schedulingErrors).length === 0,
          errors: schedulingErrors,
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
