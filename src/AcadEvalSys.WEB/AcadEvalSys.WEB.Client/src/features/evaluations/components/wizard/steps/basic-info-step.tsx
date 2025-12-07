import { memo, useMemo, useCallback } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
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
import { DateTimePicker } from "@/shared/components/ui/date-time-picker";

interface BasicInfoStepProps {
  form: UseFormReturn<EvaluationFormSchema>;
}

export const BasicInfoStep = memo(function BasicInfoStep({ form }: BasicInfoStepProps) {
  const {
    register,
    control,
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
        <Controller
          name="periodFrom"
          control={control}
          render={({ field }) => {
            // Convertir string YYYY-MM-DD a Date para el DateTimePicker
            const dateValue = field.value 
              ? new Date(field.value + 'T00:00:00') 
              : null;
            
            return (
              <DateTimePicker
                id="periodFrom"
                label="Fecha de Inicio"
                value={dateValue}
                onChange={(value) => {
                  // Convertir ISO string a formato date (YYYY-MM-DD) para el schema
                  if (value) {
                    const date = new Date(value);
                    const dateString = date.toISOString().split('T')[0];
                    field.onChange(dateString);
                  } else {
                    field.onChange('');
                  }
                }}
                placeholder="Seleccionar fecha de inicio"
                showTime={false}
                error={errors.periodFrom?.message || (dateError ? dateError : undefined)}
              />
            );
          }}
        />

        <Controller
          name="periodTo"
          control={control}
          render={({ field }) => {
            // Convertir string YYYY-MM-DD a Date para el DateTimePicker
            const dateValue = field.value 
              ? new Date(field.value + 'T00:00:00') 
              : null;
            
            // Calcular fecha mínima basada en periodFrom
            const minDate = watchedValues.periodFrom 
              ? new Date(watchedValues.periodFrom + 'T00:00:00')
              : undefined;
            
            return (
              <DateTimePicker
                id="periodTo"
                label="Fecha de Fin"
                value={dateValue}
                onChange={(value) => {
                  // Convertir ISO string a formato date (YYYY-MM-DD) para el schema
                  if (value) {
                    const date = new Date(value);
                    const dateString = date.toISOString().split('T')[0];
                    field.onChange(dateString);
                  } else {
                    field.onChange('');
                  }
                }}
                placeholder="Seleccionar fecha de fin"
                showTime={false}
                min={minDate}
                error={errors.periodTo?.message || (dateError ? dateError : undefined)}
              />
            );
          }}
        />
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
