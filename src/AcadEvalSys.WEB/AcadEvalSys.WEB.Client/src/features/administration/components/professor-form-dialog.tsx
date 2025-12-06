import { useEffect, useState, useCallback } from "react";
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
import { Eye, EyeOff } from "lucide-react";
import type { Professor } from "@infrastructure/api/types/professor";

const baseSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
});

export type ProfessorFormValues = z.infer<typeof baseSchema>;

interface ProfessorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professor?: Professor | null;
  onSubmit: (values: ProfessorFormValues) => void;
}

export function ProfessorFormDialog({
  open,
  onOpenChange,
  professor,
  onSubmit,
}: ProfessorFormDialogProps) {
  const isEditing = Boolean(professor);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ProfessorFormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: professor?.name ?? "",
      email: professor?.email ?? "",
      password: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: professor?.name ?? "",
      email: professor?.email ?? "",
      password: "",
    });
  }, [professor, form, open]);

  const handleSubmit = useCallback(
    (values: ProfessorFormValues) => {
      onSubmit(values);
      onOpenChange(false);
    },
    [onSubmit, onOpenChange]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        form.reset();
        setShowPassword(false);
      }
      onOpenChange(open);
    },
    [form, onOpenChange]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Profesor" : "Nuevo Profesor"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del profesor"
              : "Completa los datos para crear un nuevo profesor"}
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

            {/* Campo de contraseña siempre visible */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing
                      ? "Nueva Contraseña (dejar vacío para no cambiar)"
                      : "Contraseña"}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          isEditing ? "Nueva contraseña" : "Contraseña"
                        }
                        {...field}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  {!isEditing && (
                    <div className="text-xs text-muted-foreground mt-1">
                      <p>La contraseña debe contener:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>Al menos 8 caracteres</li>
                        <li>Una letra mayúscula (A-Z)</li>
                        <li>Una letra minúscula (a-z)</li>
                        <li>Un número (0-9)</li>
                        <li>Un carácter especial (!@#$%^&*)</li>
                      </ul>
                    </div>
                  )}
                </FormItem>
              )}
            />

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
