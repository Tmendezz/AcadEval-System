import { Competency } from "@infrastructure/api/types/competency";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  competencyLevelsFormSchema,
  CompetencyLevelsFormData,
} from "../schemas/competency-levels-schema";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import { useUpdateCompetency } from "@/shared/hooks/use-competencies";
import { toast } from "sonner";

interface CompetencyLevelsFormProps {
  competency: Competency;
}

const defaultLevels = ["Inicial", "Intermedio", "Avanzado", "Excelente"];

export function CompetencyLevelsForm({
  competency,
}: CompetencyLevelsFormProps) {
  const updateCompetency = useUpdateCompetency();

  const form = useForm<CompetencyLevelsFormData>({
    resolver: zodResolver(competencyLevelsFormSchema),
    defaultValues: {
      levels: defaultLevels.map((level) => {
        const existingLevel = competency.levels?.find((l) => l.level === level);
        return {
          level: level,
          description: existingLevel?.description || "",
        };
      }),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "levels",
  });

  const onSubmit = (data: CompetencyLevelsFormData) => {
    const updatedCompetency = {
      ...competency,
      levels: data.levels,
    };

    updateCompetency.mutate(
      { id: competency.id, data: updatedCompetency },
      {
        onSuccess: () => {
          toast.success("Competencia actualizada correctamente.");
        },
        onError: () => {
          toast.error("Error al actualizar la competencia.");
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`levels.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`Nivel ${form.getValues(
                  `levels.${index}.level`
                )}`}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={`Descripción para el nivel ${form.getValues(
                      `levels.${index}.level`
                    )}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" disabled={updateCompetency.isPending}>
          {updateCompetency.isPending ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </form>
    </Form>
  );
}
