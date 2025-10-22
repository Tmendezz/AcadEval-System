import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { Professor } from "@infrastructure/api/types/professor";
import { ColumnDef } from "@tanstack/react-table";

interface AdminColumnHandlers {
  onEdit?: (admin: Professor) => void;
  onDelete?: (admin: Professor) => void;
}

export const adminColumns = ({
  onEdit,
  onDelete,
}: AdminColumnHandlers = {}): ColumnDef<Professor>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: () => <Badge variant="secondary">Administrador</Badge>,
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
            title="Eliminar administrador"
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
