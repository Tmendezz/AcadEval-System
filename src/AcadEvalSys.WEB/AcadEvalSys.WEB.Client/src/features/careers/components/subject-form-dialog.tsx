import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Subject } from "../models";

const schema = z.object({
  name: z.string().min(2, "Requerido"),
  description: z.string().min(2, "Requerido"),
  year: z.enum(["First", "Second", "Third"]),
  professorId: z.string().optional(),
});

export type SubjectFormValues = z.infer<typeof schema>;

interface SubjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Subject | null;
  onSubmit: (values: SubjectFormValues) => void;
}

export function SubjectFormDialog({
  open,
  onOpenChange,
  subject,
  onSubmit,
}: SubjectFormDialogProps) {
  const isEditing = Boolean(subject);

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: subject?.name ?? "",
      description: subject?.description ?? "",
      year: (subject?.year as "First" | "Second" | "Third") ?? "First",
      professorId: (subject as { professorId?: string })?.professorId ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: subject?.name ?? "",
      description: subject?.description ?? "",
      year: (subject?.year as "First" | "Second" | "Third") ?? "First",
      professorId: (subject as { professorId?: string })?.professorId ?? "",
    });
  }, [subject, form, open]);

  const handleSubmit = (values: SubjectFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar asignatura" : "Nueva asignatura"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza los datos de la asignatura"
              : "Completa los datos para crear una asignatura"}
          </DialogDescription>
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
                    <Input placeholder="Ej: Algebra" {...field} />
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
                    <Textarea placeholder="Breve descripción" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año</FormLabel>
                  <FormControl>
                    <select
                      className="border rounded px-3 py-2 w-full"
                      {...field}
                    >
                      <option value="First">Primer año</option>
                      <option value="Second">Segundo año</option>
                      <option value="Third">Tercer año</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
