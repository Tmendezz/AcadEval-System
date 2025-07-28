import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Competency } from "@/shared/types";
import {
  competencyFormSchema,
  CompetencyFormData,
} from "../../schemas/competency";

interface CompetencyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competency?: Competency | null;
  onSubmit: (data: CompetencyFormData) => void;
}

export function CompetencyFormDialog({
  open,
  onOpenChange,
  competency,
  onSubmit,
}: CompetencyFormDialogProps) {
  const isEditing = !!competency;

  const form = useForm<CompetencyFormData>({
    resolver: zodResolver(competencyFormSchema),
    defaultValues: {
      name: competency?.name || "",
      description: competency?.description || "",
      type: (competency?.type as "Soft" | "Technical") || "Soft",
    },
  });

  const handleSubmit = (values: CompetencyFormData) => {
    onSubmit(values);
    onOpenChange(false);
    form.reset();
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
        <DialogHeader className="px-8 pt-8 pb-6">
          <DialogTitle className="text-2xl font-semibold">
            {isEditing ? "Editar Competencia" : "Nueva Competencia"}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {isEditing
              ? "Modificar los datos de la competencia existente"
              : "Complete la información para crear una nueva competencia"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col h-full"
          >
            <ScrollArea className="flex-1 px-8 max-h-[60vh]">
              <div className="space-y-8 pb-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Nombre de la Competencia
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Comunicación Efectiva"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nombre descriptivo y claro de la competencia
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Descripción
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe detalladamente qué significa esta competencia y cómo se manifiesta en el contexto académico..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explicación detallada de la competencia y su importancia
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Tipo de Competencia
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo de competencia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Soft">
                            <div className="flex items-center gap-2">
                              <span>Competencias Blandas</span>
                              <span className="text-xs text-muted-foreground">
                                (Habilidades interpersonales)
                              </span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Technical">
                            <div className="flex items-center gap-2">
                              <span>Competencias Técnicas</span>
                              <span className="text-xs text-muted-foreground">
                                (Habilidades específicas)
                              </span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Las competencias blandas se enfocan en habilidades
                        interpersonales, mientras que las técnicas se enfocan en
                        conocimientos específicos del área
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter className="px-8 py-6 border-t">
              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Actualizar" : "Crear"} Competencia
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
