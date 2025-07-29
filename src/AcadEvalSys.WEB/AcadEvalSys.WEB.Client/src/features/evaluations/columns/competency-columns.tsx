import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Competency } from "@/shared/types";
import { Edit, Trash2, Target, Brain, Eye } from "lucide-react";

export const competencyColumns: ColumnDef<Competency>[] = [
  {
    accessorKey: "name",
    header: "Nombre de la Competencia",
    cell: ({ row }) => {
      const competency = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {competency.type === "Soft" ? (
              <Brain className="h-5 w-5 text-blue-600" />
            ) : (
              <Target className="h-5 w-5 text-amber-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{competency.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {competency.description}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const competency = row.original;
      return (
        <Badge
          variant="secondary"
          className={
            competency.type === "Soft"
              ? "bg-blue-100 text-blue-800"
              : "bg-amber-100 text-amber-800"
          }
        >
          {competency.type === "Soft" ? "Blanda" : "Técnica"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de edición
        console.log("Editar competencia:", row.original.id);
      };

      const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de eliminación
        console.log("Eliminar competencia:", row.original.id);
      };

      const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de ver detalle
        console.log("Ver detalle competencia:", row.original.id);
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
