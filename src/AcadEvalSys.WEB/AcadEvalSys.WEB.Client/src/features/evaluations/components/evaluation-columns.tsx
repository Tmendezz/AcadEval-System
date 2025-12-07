"use client";
import { ColumnDef } from "@tanstack/react-table";
import { EvaluationListItem } from "@/features/evaluations/services";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { TruncatedText } from "../../../shared/components/ui/truncated-text";
import { Eye } from "lucide-react";
import { navigate } from "wouter/use-browser-location";
import { DeleteButtonWithConfirm } from "@/shared/components/ui/delete-button-with-confirm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

// Constantes fuera de la función para evitar recreación
const STATUS_TRANSLATIONS = {
  Published: "Publicada",
  Completed: "Completada",
  Draft: "Borrador",
  Archived: "Archivada",
  Pending: "Pendiente",
} as const;

const STATUS_VARIANTS = {
  Published: "default",
  Completed: "default",
  Draft: "secondary",
  Archived: "outline",
  Pending: "secondary",
} as const;

type EvaluationStatus = keyof typeof STATUS_TRANSLATIONS;

export const createEvaluationColumns = (handlers: {
  onDelete?: (evaluation: EvaluationListItem) => void;
}): ColumnDef<EvaluationListItem>[] => [
  {
    accessorKey: "title",
    header: "Título",
    size: 200,
    cell: ({ row }) => (
      <TruncatedText
        text={row.original.title}
        maxLength={30}
        className="text-xs font-medium"
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    size: 100,
    cell: ({ row }) => {
      const status = row.original.status as EvaluationStatus;
      const variant = STATUS_VARIANTS[status] || "secondary";
      const translatedStatus = STATUS_TRANSLATIONS[status] || status;

      return (
        <Badge variant={variant as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
          {translatedStatus}
        </Badge>
      );
    },
  },
	{
		accessorKey: "periodFrom",
		header: "Inicio",
		size: 100,
		cell: ({ row }) => {
			const date = row.original.periodFrom;
			return <span className="text-xs">{date ? new Date(date).toLocaleDateString() : "N/A"}</span>;
		},
	},
	{
		accessorKey: "periodTo",
		header: "Fin",
		size: 100,
		cell: ({ row }) => {
			const date = row.original.periodTo;
			return <span className="text-xs">{date ? new Date(date).toLocaleDateString() : "N/A"}</span>;
		},
	},
	{
		id: "actions",
		header: "Acciones",
		size: 100,
		cell: ({ row }) => (
			<div className="flex items-center gap-1">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button 
								variant="outline" 
								size="sm"
								className="h-7 w-7 p-0"
								onClick={() => navigate(`/evaluaciones/${row.original.id}`)}
							>
								<Eye className="h-3.5 w-3.5" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Ver</p>
						</TooltipContent>
					</Tooltip>
					{handlers.onDelete && (
						<DeleteButtonWithConfirm
							title="¿Estás seguro?"
							description={`Esta acción no se puede deshacer. ¿Desea eliminar la evaluación "${row.original.title}"?`}
							confirmText="Confirmar"
							cancelText="Cancelar"
							onConfirm={() => handlers.onDelete?.(row.original)}
						/>
					)}
				</TooltipProvider>
			</div>
		),
	},
];

// Mantener compatibilidad con el código existente
export const evaluationColumns: ColumnDef<EvaluationListItem>[] = createEvaluationColumns({});
