import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Competency } from "@/shared/types";
import { Edit, Trash2, Target, Brain } from "lucide-react";
import { Link } from "wouter";

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
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link to={`/evaluations/competencies/${row.original.id}`}>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];
