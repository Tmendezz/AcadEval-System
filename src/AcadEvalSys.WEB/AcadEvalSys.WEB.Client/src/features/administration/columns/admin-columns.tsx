import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { Professor } from "../types/professor";
import { ColumnDef } from "@tanstack/react-table";

export const adminColumns: ColumnDef<Professor>[] = [
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
        // TODO: Implementar lógica de edición
        console.log("Editar administrador:", row.original.id);
      };

      const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de eliminación
        console.log("Eliminar administrador:", row.original.id);
      };

      const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de ver detalle
        console.log("Ver detalle administrador:", row.original.id);
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="h-7 w-7 p-0"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      );
    },
  },
];
