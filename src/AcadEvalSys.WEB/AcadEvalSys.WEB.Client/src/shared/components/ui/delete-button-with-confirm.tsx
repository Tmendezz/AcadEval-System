import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Trash2, LucideIcon } from "lucide-react";

interface DeleteButtonWithConfirmProps {
  /**
   * Título del diálogo de confirmación
   */
  title: string;
  /**
   * Descripción del diálogo de confirmación
   */
  description: string;
  /**
   * Texto del botón de confirmar
   */
  confirmText?: string;
  /**
   * Texto del botón de cancelar
   */
  cancelText?: string;
  /**
   * Callback cuando se confirma la eliminación
   */
  onConfirm: () => void;
  /**
   * Icono a mostrar (default: Trash2)
   */
  icon?: LucideIcon;
  /**
   * Si está deshabilitado
   */
  disabled?: boolean;
  /**
   * Tamaño del botón
   */
  size?: "sm" | "default" | "lg" | "icon";
  /**
   * Clase CSS adicional
   */
  className?: string;
}

/**
 * Componente helper para botones de eliminar con tooltip y confirmación
 * Sigue el mismo patrón que los botones de Ver y Editar
 * El TooltipProvider está dentro del componente para evitar conflictos
 */
export function DeleteButtonWithConfirm({
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  icon: Icon = Trash2,
  disabled = false,
  size = "sm",
  className = "h-7 w-7 p-0",
}: DeleteButtonWithConfirmProps) {
  return (
    <Tooltip>
      <ConfirmDialog
        title={title}
        description={description}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={onConfirm}
        trigger={
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size={size}
              className={className}
              disabled={disabled}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Icon className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
        }
      />
      <TooltipContent>
        <p>Eliminar</p>
      </TooltipContent>
    </Tooltip>
  );
}

