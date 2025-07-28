import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Professor } from "../types/professor";

export const adminColumns = [
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
    cell: () => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
