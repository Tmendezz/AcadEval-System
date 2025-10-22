import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCreateCompetency } from "@/features/competencies/hooks/use-competencies";
import { CompetencyFormData } from "@/features/competencies/hooks/use-competencies";
import { createCompetencySchema } from "../schemas/create-competency-schema";

interface CreateCompetencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompetencyFormData) => void;
  isLoading: boolean;
}

export function CreateCompetencyModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateCompetencyModalProps) {
  const form = useForm<CompetencyFormData>({
    resolver: zodResolver(createCompetencySchema),
    defaultValues: {
      name: "",
      description: "",
      type: "Soft",
      levels: {
        Inicial: "",
        Intermedio: "",
        Avanzado: "",
        Excelente: "",
      },
    },
  });

  const handleSubmit = (data: CompetencyFormData) => {
    onSubmit(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Competencia</DialogTitle>
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
                {isLoading ? "Creando..." : "Crear Competencia"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
