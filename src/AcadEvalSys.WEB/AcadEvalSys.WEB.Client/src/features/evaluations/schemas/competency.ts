import { z } from "zod";
import { createZodValidator } from "@/shared/utils/zod-validation";

export const competencyFormSchema = z.object({
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
    errorMap: () => ({ message: "Selecciona un tipo de competencia válido" }),
  }),
});

export type CompetencyFormData = z.infer<typeof competencyFormSchema>;

/**
 * Validador con formateo de errores escalable
 */
export const validateCompetencyForm = createZodValidator(competencyFormSchema);
