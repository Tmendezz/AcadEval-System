"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { TruncatedText } from "../../../shared/components/ui/truncated-text";
import { DeleteButtonWithConfirm } from "@/shared/components/ui/delete-button-with-confirm";
import { Competency } from "../models";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface CompetencyColumnsProps {
  onViewClick?: (competency: Competency) => void;
  onEditClick?: (competency: Competency) => void;
  onDeleteClick?: (competencyId: string) => void;
}

export const createCompetencyColumns = ({
  onViewClick,
  onEditClick,
  onDeleteClick,
}: CompetencyColumnsProps): ColumnDef<Competency>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
    size: 180,
    cell: ({ row }) => (
      <TruncatedText text={row.original.name} maxLength={25} className="text-xs font-medium" />
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    size: 100,
    cell: ({ row }) => {
      const type = row.original.type;
      const variant = type === "Soft" ? "secondary" : "default";
      const typeLabel = type === "Soft" ? "Blanda" : "Técnica";
      return (
        <Badge
          variant={
            variant as "default" | "secondary" | "destructive" | "outline"
          }
          className="text-xs"
        >
          {typeLabel}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    size: 250,
    cell: ({ row }) => (
      <TruncatedText 
        text={row.original.description} 
        maxLength={35}
        className="text-xs text-muted-foreground"
      />
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    size: 120,
    cell: ({ row }) => {
      const competency = row.original;

      return (
        <div className="flex items-center gap-1">
          <TooltipProvider>
            {onViewClick && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onViewClick(competency)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver</p>
                </TooltipContent>
              </Tooltip>
            )}

            {onEditClick && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => onEditClick(competency)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>
            )}

            {onDeleteClick && (
              <DeleteButtonWithConfirm
                title="¿Estás seguro?"
                description="Esta acción no se puede deshacer. Esto eliminará permanentemente la competencia."
                confirmText="Confirmar"
                cancelText="Cancelar"
                onConfirm={() => onDeleteClick(competency.id)}
              />
            )}
          </TooltipProvider>
        </div>
      );
    },
  },
];
