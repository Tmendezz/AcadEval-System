import { memo, useMemo, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { EvaluationFormSchema } from "../../../schemas/evaluation-form";
import { useMemo } from "react";

interface BasicInfoStepProps {
  form: UseFormReturn<EvaluationFormSchema>;
}

export const BasicInfoStep = memo(function BasicInfoStep({ form }: BasicInfoStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const watchedValues = watch();

  // Validar fechas en tiempo real
  const dateError = useMemo(() => {
    if (watchedValues.periodFrom && watchedValues.periodTo) {
      const from = new Date(watchedValues.periodFrom);
      const to = new Date(watchedValues.periodTo);
      if (to <= from) {
        return "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }
    return null;
  }, [watchedValues.periodFrom, watchedValues.periodTo]);

  // Handler memoizado para cambio de semestre
  const handleSemesterChange = useCallback(
    (value: string) => setValue("semester", value as "First" | "Second"),
    [setValue]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título de la Evaluación</Label>
        <Input
          id="title"
          placeholder="Ej: Evaluación de Competencias 2025 - Primer Semestre"
          {...register("title")}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Describe el propósito y alcance de esta evaluación..."
          {...register("description")}
          className={errors.description ? "border-red-500" : ""}
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semestre</Label>
        <Select
          value={watchedValues.semester}
          onValueChange={handleSemesterChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="First">Primer Semestre</SelectItem>
            <SelectItem value="Second">Segundo Semestre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="periodFrom">Fecha de Inicio</Label>
          <Input
            id="periodFrom"
            type="date"
            {...register("periodFrom")}
            className={errors.periodFrom || dateError ? "border-red-500" : ""}
          />
          {errors.periodFrom && (
            <p className="text-sm text-red-500">{errors.periodFrom.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="periodTo">Fecha de Fin</Label>
          <Input
            id="periodTo"
            type="date"
            {...register("periodTo")}
            className={errors.periodTo || dateError ? "border-red-500" : ""}
          />
          {errors.periodTo && (
            <p className="text-sm text-red-500">{errors.periodTo.message}</p>
          )}
        </div>
      </div>

      {dateError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{dateError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
});
