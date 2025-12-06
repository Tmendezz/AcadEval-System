import { memo, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { CompetencyDto as Competency } from "@/features/competencies/services/competency-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editCompetencySchema,
  EditCompetencyFormData,
} from "../schemas/edit-competency-schema";
import type { CompetencyFormData } from "@/features/competencies/hooks/use-competencies";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface EditCompetencyModalProps {
  competency: Competency;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompetencyFormData) => void;
  isLoading: boolean;
}

// Helper para extraer descripción de nivel
const getLevelDescription = (levels: Competency["levels"], level: string): string =>
  levels?.find((l) => l.level === level)?.description || "";

export const EditCompetencyModal = memo(function EditCompetencyModal({
  competency,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: EditCompetencyModalProps) {
  // Memoizar valores por defecto
  const defaultValues = useMemo(
    () => ({
      name: competency.name,
      description: competency.description,
      type: competency.type,
      levels: {
        Inicial: getLevelDescription(competency.levels, "Inicial"),
        Intermedio: getLevelDescription(competency.levels, "Intermedio"),
        Avanzado: getLevelDescription(competency.levels, "Avanzado"),
        Excelente: getLevelDescription(competency.levels, "Excelente"),
      },
    }),
    [competency]
  );

  const form = useForm<EditCompetencyFormData>({
    resolver: zodResolver(editCompetencySchema),
    defaultValues,
  });

  const handleSubmit = useCallback(
    (data: EditCompetencyFormData) => {
      onSubmit({
        ...data,
        type: data.type as "Technical" | "Soft",
        levels: data.levels,
      });
    },
    [onSubmit]
  );

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Competencia</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la competencia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción de la competencia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Soft">Blanda</SelectItem>
                      <SelectItem value="Technical">Técnica</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Descripciones por nivel</FormLabel>
              {(["Inicial", "Intermedio", "Avanzado", "Excelente"] as const).map((nivel) => (
                <FormField
                  key={nivel}
                  control={form.control}
                  name={`levels.${nivel}` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{nivel}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`Descripción para nivel ${nivel}`}
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
