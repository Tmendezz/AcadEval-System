import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash, Users, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {EnrolledStudent} from "@features/careers";
import { TruncatedText } from "@/shared/components/ui/truncated-text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export const studentColumns: ColumnDef<EnrolledStudent>[] = [
	{
		accessorKey: "studentName",
		header: "Estudiante",
		size: 200,
		cell: ({ row }) => (
			<div className="flex items-center space-x-2">
				<div className="flex-shrink-0">
					<Users className="h-4 w-4 text-muted-foreground" />
				</div>
				<div className="min-w-0 flex-1">
					<TruncatedText
						text={row.original.studentName}
						maxLength={25}
						className="font-medium text-xs"
					/>
				</div>
			</div>
		),
	},
	{
		accessorKey: "studentEmail",
		header: "Email",
		size: 200,
		cell: ({ row }) => (
			<TruncatedText
				text={row.original.studentEmail}
				maxLength={30}
				className="text-xs text-muted-foreground"
			/>
		),
	},
	{
		accessorKey: "actions",
		header: "Acciones",
		size: 120,
		cell: ({ row }) => {
			const handleEdit = (e: React.MouseEvent) => {
				e.stopPropagation();
				// TODO: Implementar lógica de edición
			};

			const handleDelete = (e: React.MouseEvent) => {
				e.stopPropagation();
				// TODO: Implementar lógica de eliminación
			};

			const handleView = (e: React.MouseEvent) => {
				e.stopPropagation();
				// TODO: Implementar lógica de ver detalle
			};

			return (
				<div className="flex items-center gap-1">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-7 w-7 p-0"
									onClick={handleView}
								>
									<Eye className="h-3.5 w-3.5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Ver</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-7 w-7 p-0"
									onClick={handleEdit}
								>
									<Pencil className="h-3.5 w-3.5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Editar</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="destructive"
									size="sm"
									className="h-7 w-7 p-0"
									onClick={handleDelete}
								>
									<Trash className="h-3.5 w-3.5" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Eliminar</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			);
		},
	},
];
