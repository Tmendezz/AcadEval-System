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
import { Professor } from "@infrastructure/api/types/professor";

const baseSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
});

const createSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
    .regex(
      /[^A-Za-z0-9]/,
      "La contraseña debe contener al menos un carácter especial"
    ),
});

const editSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 8,
      "La contraseña debe tener al menos 8 caracteres"
    )
    .refine(
      (val) => !val || /[A-Z]/.test(val),
      "La contraseña debe contener al menos una letra mayúscula"
    )
    .refine(
      (val) => !val || /[a-z]/.test(val),
      "La contraseña debe contener al menos una letra minúscula"
    )
    .refine(
      (val) => !val || /[0-9]/.test(val),
      "La contraseña debe contener al menos un número"
    )
    .refine(
      (val) => !val || /[^A-Za-z0-9]/.test(val),
      "La contraseña debe contener al menos un carácter especial"
    ),
});

export type AdminFormValues = z.infer<typeof createSchema>;

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
  const [showPassword, setShowPassword] = useState(false);

  const schema = isEditing ? editSchema : createSchema;

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: administrator?.name ?? "",
      email: administrator?.email ?? "",
      password: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: administrator?.name ?? "",
      email: administrator?.email ?? "",
      password: "",
    });
  }, [administrator, form, open]);

  const handleSubmit = useCallback(
    (values: AdminFormValues) => {
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
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
