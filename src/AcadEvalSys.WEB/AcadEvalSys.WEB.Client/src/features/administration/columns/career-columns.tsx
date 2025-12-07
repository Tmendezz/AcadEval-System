import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Edit, Eye } from "lucide-react";
import type { TechnicalCareer } from "@infrastructure/api/types/technical-career";
import { DeleteButtonWithConfirm } from "@/shared/components/ui/delete-button-with-confirm";
import { ColumnDef } from "@tanstack/react-table";
import { TruncatedText } from "@/shared/components/ui/truncated-text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export const careerColumns = (
  handlers: {
    onEdit?: (career: TechnicalCareer) => void;
    onDelete?: (career: TechnicalCareer) => void;
    onView?: (career: TechnicalCareer) => void;
  } = {}
): ColumnDef<TechnicalCareer>[] => [
  {
    accessorKey: "name",
    header: "Carrera",
    size: 250,
    cell: ({ row }) => (
      <TruncatedText text={row.original.name} maxLength={30} className="font-medium text-xs" />
    ),
  },
  {
    accessorKey: "totalStudents",
    header: "Estudiantes",
    size: 100,
    cell: ({ row }) => (
      <span className="text-xs">{row.original.totalStudents || 0}</span>
    ),
  },
  {
    accessorKey: "totalProfessors",
    header: "Profesores",
    size: 100,
    cell: ({ row }) => (
      <span className="text-xs">{row.original.totalProfessors || 0}</span>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    size: 120,
    cell: ({ row }) => {
      const { onEdit, onDelete, onView } = handlers;
      const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.(row.original);
      };

      const handleDelete = () => onDelete?.(row.original);

      const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        onView?.(row.original);
      };

      return (
        <div className="flex items-center gap-1">
          <TooltipProvider>
            {onView && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={handleView}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver</p>
                </TooltipContent>
              </Tooltip>
            )}
            {onEdit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={handleEdit}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>
            )}
            {onDelete && (
              <DeleteButtonWithConfirm
                title="Eliminar carrera técnica"
                description={`Esta acción no se puede deshacer. ¿Desea eliminar ${row.original.name}?`}
                confirmText="Confirmar"
                cancelText="Cancelar"
                onConfirm={handleDelete}
              />
            )}
          </TooltipProvider>
        </div>
      );
    },
  },
];
