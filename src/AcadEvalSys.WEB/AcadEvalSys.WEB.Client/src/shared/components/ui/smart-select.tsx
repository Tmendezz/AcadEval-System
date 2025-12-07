import { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface SmartSelectProps<T extends { id: string }> {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: T[];
  renderOption: (option: T) => ReactNode;
  renderValue?: (option: T | undefined) => ReactNode;
  emptyMessage?: string;
  triggerClassName?: string;
}

export function SmartSelect<T extends { id: string }>({
  value,
  onValueChange,
  placeholder,
  options,
  renderOption,
  renderValue,
  emptyMessage = "No hay opciones disponibles",
  triggerClassName,
}: SmartSelectProps<T>) {
  const selectedOption = options.find((opt) => opt.id === value);
  const displayValue = renderValue 
    ? renderValue(selectedOption)
    : selectedOption 
    ? renderOption(selectedOption)
    : null;

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder={placeholder}>
          {displayValue}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>
              {renderOption(opt)}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
