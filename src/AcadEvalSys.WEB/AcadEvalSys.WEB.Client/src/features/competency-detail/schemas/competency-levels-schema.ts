import { z } from "zod";

export const competencyLevelSchema = z.object({
  level: z.string(),
  description: z.string().min(1, "La descripción es requerida."),
});

export const competencyLevelsFormSchema = z.object({
  levels: z.array(competencyLevelSchema),
});

export type CompetencyLevelsFormData = z.infer<typeof competencyLevelsFormSchema>;
