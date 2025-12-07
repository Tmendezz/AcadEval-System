import { z } from "zod";
import { createZodValidator, ZodErrorMappings } from "@/shared/utils/zod-validation";

export const editCompetencySchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  description: z.string().min(1, "La descripción es requerida."),
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

export type EditCompetencyFormData = z.infer<typeof editCompetencySchema>;

/**
 * Validador con formateo de errores escalable
 * Usa mapeos para convertir paths de Zod a formatos de UI
 */
export const validateEditCompetency = createZodValidator(
  editCompetencySchema,
  [ZodErrorMappings.levels]
);
