import React from "react";

import { Button } from "@/shared/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import type { ColumnDef } from "@tanstack/react-table";
import type { ProfessorDto } from "../services/professor-service";

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
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.(row.original);
      };

      const handleDelete = () => onDelete?.(row.original);

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <ConfirmDialog
            title="Eliminar profesor"
            description={`Esta acción no se puede deshacer. ¿Desea eliminar a ${row.original.name}?`}
            confirmText="Confirmar"
            cancelText="Cancelar"
            onConfirm={handleDelete}
            trigger={
              <Button
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            }
          />
        </div>
      );
    },
  },
];
