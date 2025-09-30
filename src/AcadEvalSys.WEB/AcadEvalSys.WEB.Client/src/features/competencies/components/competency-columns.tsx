"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";
import { TruncatedText } from "../../../shared/components/ui/truncated-text";
import { ConfirmationModal } from "@/shared/components/ui/confirmation-modal";
import { Competency } from "../models";

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
      <TruncatedText 
        text={row.original.description} 
        maxLength={40}
        className="text-sm text-muted-foreground"
      />
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const competency = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(`/competencias/${competency.id}`, "_blank")
            }
          >
            <Eye className="h-4 w-4" />
            Ver
          </Button>

          {onEditClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditClick(competency)}
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          )}

          {onDeleteClick && (
            <ConfirmationModal
              title="¿Estás seguro?"
              description="Esta acción no se puede deshacer. Esto eliminará permanentemente la competencia."
              onConfirm={() => onDeleteClick(competency.id)}
            >
              <Button
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
                Eliminar
              </Button>
            </ConfirmationModal>
          )}
        </div>
      );
    },
  },
];
