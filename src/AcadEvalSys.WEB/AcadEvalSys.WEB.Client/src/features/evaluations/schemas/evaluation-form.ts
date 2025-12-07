import { z } from "zod";
import { createZodValidator, ZodErrorMappings } from "@/shared/utils/zod-validation";

export const evaluationFormSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .min(3, "El título debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  semester: z.enum(["First", "Second"]),
  periodFrom: z.string().min(1, "La fecha de inicio es requerida"),
  periodTo: z.string().min(1, "La fecha de fin es requerida"),
  competencyAssignments: z
    .array(
      z.object({
        competencyId: z.string(),
        subjectId: z.string(),
      })
    )
    .min(1, "Debe asignar al menos una competencia"),
}).refine(
  (data) => {
    // Validar que la fecha de fin sea posterior a la de inicio
    if (data.periodFrom && data.periodTo) {
      const from = new Date(data.periodFrom);
      const to = new Date(data.periodTo);
      return to > from;
    }
    return true;
  },
  {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["periodTo"],
  }
);

export type EvaluationFormSchema = z.infer<typeof evaluationFormSchema>;

/**
 * Validador con formateo de errores escalable
 * Usa mapeos para convertir paths de Zod a formatos de UI
 */
export const validateEvaluationForm = createZodValidator(
  evaluationFormSchema,
  [ZodErrorMappings.competencyAssignments]
);
