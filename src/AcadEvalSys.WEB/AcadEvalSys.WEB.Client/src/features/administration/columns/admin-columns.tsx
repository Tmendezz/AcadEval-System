import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { Professor } from "../types/professor";
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
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="h-7 w-7 p-0"
            title="Editar"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <ConfirmDialog
            title="Eliminar administrador"
            description={`Esta acción no se puede deshacer. ¿Desea eliminar a ${row.original.name}?`}
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
