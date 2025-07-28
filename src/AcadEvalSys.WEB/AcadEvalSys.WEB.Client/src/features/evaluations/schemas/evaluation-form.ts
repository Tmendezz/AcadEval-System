import { z } from "zod";

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
});

export type EvaluationFormSchema = z.infer<typeof evaluationFormSchema>;
