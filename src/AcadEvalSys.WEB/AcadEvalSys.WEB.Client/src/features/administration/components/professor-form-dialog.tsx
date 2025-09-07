import { useEffect, useState } from "react";
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
import { Separator } from "@/shared/components/ui/separator";
import { Key, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
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
  const [isResetting, setIsResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");

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
    setNewPassword("");
  }, [professor, form, open]);

  const handleSubmit = (values: ProfessorFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  const handleClose = () => {
    setNewPassword("");
    onOpenChange(false);
  };

  const handleResetPassword = async () => {
    if (!professor?.id || !newPassword.trim()) {
      toast.error("Debe ingresar una nueva contraseña");
      return;
    }

    setIsResetting(true);
    try {
      const response = await fetch("/api/user-password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: professor.id, newPassword }),
      });

      if (response.ok) {
        toast.success("Contraseña actualizada exitosamente");
        setNewPassword("");
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al actualizar contraseña");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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

            {/* Gestión de contraseñas solo para edición */}
            {isEditing && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-medium">Cambiar Contraseña</h4>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nueva contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      onClick={handleResetPassword}
                      disabled={isResetting || !newPassword.trim()}
                      className="w-full"
                    >
                      {isResetting ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        "Actualizar Contraseña"
                      )}
                    </Button>
                  </div>
                </div>
              </>
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
