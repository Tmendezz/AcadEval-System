import { z } from "zod";
import { createZodValidator, ZodErrorMappings } from "@/shared/utils/zod-validation";

export const createCompetencySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  type: z.enum(["Soft", "Technical"], {
    required_error: "Debe seleccionar un tipo de competencia",
  }),
  levels: z.object({
    Inicial: z.string().min(1, "Requerido"),
    Intermedio: z.string().min(1, "Requerido"),
    Avanzado: z.string().min(1, "Requerido"),
    Excelente: z.string().min(1, "Requerido"),
  }),
});

export type CreateCompetencyFormData = z.infer<typeof createCompetencySchema>;

/**
 * Validador con formateo de errores escalable
 * Usa mapeos para convertir paths de Zod a formatos de UI
 */
export const validateCreateCompetency = createZodValidator(
  createCompetencySchema,
  [ZodErrorMappings.levels]
);
