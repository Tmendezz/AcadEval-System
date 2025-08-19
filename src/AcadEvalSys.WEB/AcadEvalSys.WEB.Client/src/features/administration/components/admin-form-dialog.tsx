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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Professor } from "@/shared/types";

const baseSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  password: z.string().optional(),
});

export type AdminFormValues = z.infer<typeof baseSchema>;

interface AdminFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  administrator?: Professor | null;
  onSubmit: (values: AdminFormValues) => void;
}

export function AdminFormDialog({
  open,
  onOpenChange,
  administrator,
  onSubmit,
}: AdminFormDialogProps) {
  const isEditing = Boolean(administrator);

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: administrator?.name ?? "",
      email: administrator?.email ?? "",
      phone: administrator?.phone ?? "",
      password: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: administrator?.name ?? "",
      email: administrator?.email ?? "",
      phone: administrator?.phone ?? "",
      password: "",
    });
  }, [administrator, form, open]);

  const handleSubmit = (values: AdminFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Administrador" : "Nuevo Administrador"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del administrador"
              : "Completa los datos para crear un nuevo administrador"}
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
                    <Input placeholder="Juan Perez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Contraseña temporal"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
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
