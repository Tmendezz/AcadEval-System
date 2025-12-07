import React from "react";

import { Button } from "@/shared/components/ui/button";
import { Edit } from "lucide-react";
import { DeleteButtonWithConfirm } from "@/shared/components/ui/delete-button-with-confirm";
import type { ColumnDef } from "@tanstack/react-table";
import type { ProfessorDto } from "../services/professor-service";
import { TruncatedText } from "@/shared/components/ui/truncated-text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface ProfessorColumnHandlers {
  onEdit?: (prof: ProfessorDto) => void;
  onDelete?: (prof: ProfessorDto) => void;
}

export const professorColumns = ({
  onEdit,
  onDelete,
}: ProfessorColumnHandlers = {}): ColumnDef<ProfessorDto>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
    size: 180,
    cell: ({ row }) => (
      <TruncatedText text={row.original.name} maxLength={25} className="text-xs" />
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 200,
    cell: ({ row }) => (
      <TruncatedText text={row.original.email} maxLength={30} className="text-xs" />
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    size: 100,
    cell: ({ row }) => {
      const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.(row.original);
      };

      const handleDelete = () => onDelete?.(row.original);

      return (
        <div className="flex items-center gap-1">
          <TooltipProvider>
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
            <DeleteButtonWithConfirm
              title="Eliminar profesor"
              description={`Esta acción no se puede deshacer. ¿Desea eliminar a ${row.original.name}?`}
              confirmText="Confirmar"
              cancelText="Cancelar"
              onConfirm={handleDelete}
            />
          </TooltipProvider>
        </div>
      );
    },
  },
];
