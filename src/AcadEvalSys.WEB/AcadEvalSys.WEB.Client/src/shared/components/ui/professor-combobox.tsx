import { useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shared/components/ui/command";
import { ChevronsUpDown, Plus, CircleUser } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface ProfessorOption {
  value: string;
  label: string;
}

interface ProfessorComboboxProps {
  value?: string;
  onChange: (value?: string, label?: string) => void;
  options: ProfessorOption[];
  placeholder?: string;
  fallbackLabel?: string;
  onRequestCreate?: () => void;
  disabled?: boolean;
  className?: string;
  onSearch?: (term: string) => void;
  isLoading?: boolean;
  searchTerm?: string;
}

export function ProfessorCombobox({
  value,
  onChange,
  options,
  placeholder = "Profesor",
  fallbackLabel,
  onRequestCreate,
  disabled,
  className,
  onSearch,
  isLoading,
  searchTerm,
}: ProfessorComboboxProps) {
  const [open, setOpen] = useState(false);
  const [localSelectedLabel, setLocalSelectedLabel] = useState<
    string | undefined
  >(undefined);

  const label = useMemo(
    () =>
      options.find((o) => o.value === (value ?? "").trim())?.label ||
      (value ? fallbackLabel : undefined),
    [options, value, fallbackLabel]
  );

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) {
          onSearch?.("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("justify-between", className)}
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
        >
          <span className="truncate text-left min-w-0">
            {label || localSelectedLabel || fallbackLabel || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput
            placeholder="Buscar profesor..."
            value={searchTerm}
            onValueChange={(v) => onSearch?.(v)}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Buscando..." : "Sin resultados"}
            </CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    console.log("🎯 CommandItem onSelect llamado:", {
                      optValue: opt.value,
                      optLabel: opt.label,
                      currentValue: value,
                    });
                    setLocalSelectedLabel(opt.label);
                    console.log(
                      "📞 Llamando onChange con:",
                      opt.value,
                      opt.label
                    );
                    onChange(opt.value, opt.label);
                    setOpen(false);
                  }}
                >
                  <CircleUser
                    className={cn(
                      "mr-2 h-4 w-4",
                      (value ?? "").trim() === opt.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span className="truncate">{opt.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {onRequestCreate && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      onRequestCreate();
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Crear nuevo profesor
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
