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
import { useCompetencyById, useUpdateCompetency } from "@/features/competencies/hooks/use-competencies";

interface EditCompetencyModalProps {
  competency: Competency;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompetencyFormData) => void;
  isLoading: boolean;
}

export function EditCompetencyModal({
  competency,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: EditCompetencyModalProps) {
  const form = useForm<EditCompetencyFormData>({
    resolver: zodResolver(editCompetencySchema),
    defaultValues: {
      name: competency.name,
      description: competency.description,
      type: competency.type,
      levels: {
        Inicial:
          (competency.levels || []).find((l) => l.level === "Inicial")?.description || "",
        Intermedio:
          (competency.levels || []).find((l) => l.level === "Intermedio")?.description || "",
        Avanzado:
          (competency.levels || []).find((l) => l.level === "Avanzado")?.description || "",
        Excelente:
          (competency.levels || []).find((l) => l.level === "Excelente")?.description || "",
      },
    },
  });

  const handleSubmit = (data: EditCompetencyFormData) => {
    onSubmit({
      ...data,
      type: data.type as "Technical" | "Soft",
      levels: data.levels,
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

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
}
