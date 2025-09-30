"use client";
import { ColumnDef } from "@tanstack/react-table";
import { EvaluationListItem } from "@/features/evaluations/services";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { TruncatedText } from "../../../shared/components/ui/truncated-text";
import { Eye, Trash2 } from "lucide-react";
import { navigate } from "wouter/use-browser-location";

export const createEvaluationColumns = (handlers: {
  onDelete?: (evaluation: EvaluationListItem) => void;
}) => [
	{
		accessorKey: "title",
		header: "Título",
		size: 180,	
		minSize: 150,
		cell: ({ row }) => (
			<TruncatedText 
				text={row.original.title} 
				maxLength={30}
				className="text-sm font-medium"
			/>
		),
	},
	{
		accessorKey: "status",
		header: "Estado",
		cell: ({ row }) => {
			const status = row.original.status as keyof typeof statusTranslations;
			const statusTranslations = {
				Published: "Publicada",
				Completed: "Completada",
				Draft: "Borrador",
				Archived: "Archivada",
				Pending: "Pendiente",
			} as const;

			const variantMap = {
				Published: "default",
				Completed: "default",
				Draft: "secondary",
				Archived: "outline",
				Pending: "secondary",
			} as const;

			const variant = variantMap[status];
			const translatedStatus = statusTranslations[status] || status;

			return (
				<Badge
					variant={
						variant as "default" | "secondary" | "destructive" | "outline"
					}
				>
					{translatedStatus}
				</Badge>
			);
		},
	},
	{
		accessorKey: "periodFrom",
		header: "Fecha de Inicio",
		cell: ({ row }) => {
			const date = row.original.periodFrom;
			return date ? new Date(date).toLocaleDateString() : "N/A";
		},
	},
	{
		accessorKey: "periodTo",
		header: "Fecha de Fin",
		cell: ({ row }) => {
			const date = row.original.periodTo;
			return date ? new Date(date).toLocaleDateString() : "N/A";
		},
	},
	{
		id: "actions",
		header: "Acciones",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Button 
					variant="outline" 
					size="sm" 
					onClick={() => navigate(`/evaluaciones/${row.original.id}`)}
				>
					<Eye className="h-4 w-4" />
					Ver
				</Button>
				{handlers.onDelete && (
					<Button 
						variant="outline" 
						size="sm" 
						onClick={() => handlers.onDelete?.(row.original)}
						className="text-red-600 hover:text-red-700 hover:bg-red-50"
					>
						<Trash2 className="h-4 w-4" />
						Eliminar
					</Button>
				)}
			</div>
		),
	},
];

// Mantener compatibilidad con el código existente
export const evaluationColumns: ColumnDef<EvaluationListItem>[] = createEvaluationColumns({});
