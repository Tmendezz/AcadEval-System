import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import type { TechnicalCareer } from "@infrastructure/api/types/technical-career";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { ColumnDef } from "@tanstack/react-table";

export const careerColumns = (
  handlers: {
    onEdit?: (career: TechnicalCareer) => void;
    onDelete?: (career: TechnicalCareer) => void;
    onView?: (career: TechnicalCareer) => void;
  } = {}
): ColumnDef<TechnicalCareer>[] => [
  {
    accessorKey: "name",
    header: "Nombre de la Carrera",
  },
  {
    accessorKey: "totalStudents",
    header: "Estudiantes",
  },
  {
    accessorKey: "totalProfessors",
    header: "Profesores",
  },
  {
    id: "actions",
    header: "Acciones",
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
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            className="h-7 w-7 p-0"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="h-7 w-7 p-0"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <ConfirmDialog
            title="Eliminar carrera técnica"
            description={`Esta acción no se puede deshacer. ¿Desea eliminar ${row.original.name}?`}
            confirmText="Confirmar"
            cancelText="Cancelar"
            onConfirm={handleDelete}
            trigger={
              <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                <Trash2 className="w-3 h-3" />
              </Button>
            }
          />
        </div>
      );
    },
  },
];
