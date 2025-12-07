import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@infrastructure/lib/cn";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export interface DateTimePickerProps {
  /**
   * Valor de la fecha y hora en formato ISO string o Date
   */
  value?: string | Date | null;
  /**
   * Callback cuando cambia el valor
   */
  onChange?: (value: string | null) => void;
  /**
   * Placeholder del input
   */
  placeholder?: string;
  /**
   * Si está deshabilitado
   */
  disabled?: boolean;
  /**
   * Fecha mínima permitida
   */
  min?: Date | string;
  /**
   * Fecha máxima permitida
   */
  max?: Date | string;
  /**
   * Si muestra el selector de hora (default: true)
   */
  showTime?: boolean;
  /**
   * Clase CSS adicional
   */
  className?: string;
  /**
   * ID del input
   */
  id?: string;
  /**
   * Label del campo
   */
  label?: string;
  /**
   * Si hay error de validación
   */
  error?: string;
}

/**
 * Componente DateTimePicker usando shadcn/ui
 * Combina Calendar y selector de hora en un Popover
 */
export function DateTimePicker({
  value,
  onChange,
  placeholder = "Seleccionar fecha y hora",
  disabled = false,
  min,
  max,
  showTime = true,
  className,
  id,
  label,
  error,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [timeValue, setTimeValue] = React.useState<string>(() => {
    if (value) {
      const date = new Date(value);
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    return '00:00';
  });

  // Convertir min/max a Date si son strings
  const minDate = React.useMemo(() => {
    if (!min) return undefined;
    return typeof min === 'string' ? new Date(min) : min;
  }, [min]);

  const maxDate = React.useMemo(() => {
    if (!max) return undefined;
    return typeof max === 'string' ? new Date(max) : max;
  }, [max]);

  // Actualizar fecha seleccionada cuando cambia el valor externo
  React.useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      setTimeValue(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`);
    } else {
      setSelectedDate(undefined);
      setTimeValue('00:00');
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      onChange?.(null);
      return;
    }

    // Si hay hora seleccionada, combinarla con la fecha
    if (showTime && timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);
    } else {
      date.setHours(0, 0, 0, 0);
    }

    setSelectedDate(date);
    onChange?.(date.toISOString());
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);

    if (selectedDate && newTime) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes, 0, 0);
      setSelectedDate(newDate);
      onChange?.(newDate.toISOString());
    }
  };

  const displayValue = React.useMemo(() => {
    if (!selectedDate) return '';
    if (showTime) {
      return format(selectedDate, "PPP 'a las' HH:mm", { locale: es });
    }
    return format(selectedDate, "PPP", { locale: es });
  }, [selectedDate, showTime]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className="mb-1 block">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              error && "border-destructive",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? displayValue : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 space-y-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
              initialFocus
            />
            {showTime && (
              <div className="flex items-center gap-2 border-t pt-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={timeValue}
                  onChange={handleTimeChange}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}


