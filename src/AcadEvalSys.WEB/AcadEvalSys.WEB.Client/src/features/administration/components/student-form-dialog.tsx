import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { toast } from "sonner";
import { Student, StudentFormValues } from "../services/student-service";
import { technicalCareerService } from "@/features/careers/services/technical-career-service";
import { useQuery } from "@tanstack/react-query";
import type { TechnicalCareer } from "@/features/careers/models";

const studentFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().optional(),
  currentYear: z.number().min(1).max(3),
  technicalCareerId: z.string().min(1, "Debe seleccionar una carrera"),
});

type StudentFormData = z.infer<typeof studentFormSchema>;

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  onSubmit: (values: StudentFormValues) => Promise<void>;
  onChangePassword?: (student: Student, newPassword: string) => Promise<void>;
}

export function StudentFormDialog({
  open,
  onOpenChange,
  student,
  onSubmit,
  onChangePassword,
}: StudentFormDialogProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const { data: careers = [] } = useQuery<TechnicalCareer[]>({
    queryKey: ["technical-careers"],
    queryFn: () => technicalCareerService.getAll(),
  });

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: student?.name || "",
      email: student?.email || "",
      password: "",
      currentYear: student?.currentYear || 1,
      technicalCareerId: student?.technicalCareerId || "",
    },
  });

  const handleSubmit = async (values: StudentFormData) => {
    try {
      await onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch {
      toast.error("Error al guardar el estudiante");
    }
  };

  const handleChangePassword = async () => {
    if (!student || !newPassword.trim()) {
      toast.error("Debe ingresar una nueva contraseña");
      return;
    }

    try {
      await onChangePassword?.(student, newPassword);
      setNewPassword("");
      setIsChangingPassword(false);
      toast.success("Contraseña actualizada correctamente");
    } catch {
      toast.error("Error al cambiar la contraseña");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setNewPassword("");
      setIsChangingPassword(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {student ? "Editar Estudiante" : "Nuevo Estudiante"}
          </DialogTitle>
          <DialogDescription>
            {student
              ? "Modifica la información del estudiante"
              : "Agrega un nuevo estudiante al sistema"}
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
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del estudiante" {...field} />
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
                      placeholder="email@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!student && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Contraseña inicial"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="currentYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año de Carrera</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar año" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Primer Año</SelectItem>
                      <SelectItem value="2">Segundo Año</SelectItem>
                      <SelectItem value="3">Tercer Año</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technicalCareerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrera Técnica</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar carrera" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {careers.map((career) => (
                        <SelectItem key={career.id} value={career.id}>
                          {career.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {student && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Cambiar Contraseña</h4>

                  {!isChangingPassword ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsChangingPassword(true)}
                      className="w-full"
                    >
                      Cambiar Contraseña
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsChangingPassword(false);
                            setNewPassword("");
                          }}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          onClick={handleChangePassword}
                          className="flex-1"
                        >
                          Actualizar Contraseña
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">{student ? "Actualizar" : "Crear"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
