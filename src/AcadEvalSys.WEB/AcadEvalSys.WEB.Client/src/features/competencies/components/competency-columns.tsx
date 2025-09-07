"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Competency } from "@infrastructure/api/types/competency";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";
import { ConfirmationModal } from "@/shared/components/ui/confirmation-modal";

interface CompetencyColumnsProps {
  onEditClick?: (competency: Competency) => void;
  onDeleteClick?: (competencyId: string) => void;
}

export const createCompetencyColumns = ({
  onEditClick,
  onDeleteClick,
}: CompetencyColumnsProps): ColumnDef<Competency>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.original.type;
      const variant = type === "Soft" ? "secondary" : "default";
      return (
        <Badge
          variant={
            variant as "default" | "secondary" | "destructive" | "outline"
          }
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => (
      <p className="truncate max-w-xs">{row.original.description}</p>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const competency = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              window.open(`/competencias/${competency.id}`, "_blank")
            }
          >
            <Eye className="h-4 w-4" />
          </Button>

          {onEditClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditClick(competency)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}

          {onDeleteClick && (
            <ConfirmationModal
              title="¿Estás seguro?"
              description="Esta acción no se puede deshacer. Esto eliminará permanentemente la competencia."
              onConfirm={() => onDeleteClick(competency.id)}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </ConfirmationModal>
          )}
        </div>
      );
    },
  },
];
