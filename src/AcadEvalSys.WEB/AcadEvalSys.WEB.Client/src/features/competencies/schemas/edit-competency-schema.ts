import { z } from "zod";

export const editCompetencySchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  description: z.string().min(1, "La descripción es requerida."),
  type: z.string(),
});

export type EditCompetencyFormData = z.infer<typeof editCompetencySchema>;
