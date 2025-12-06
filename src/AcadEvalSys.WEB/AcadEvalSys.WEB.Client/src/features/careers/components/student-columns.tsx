import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash, Users, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {EnrolledStudent} from "@features/careers";

export const studentColumns: ColumnDef<EnrolledStudent>[] = [
	{
		accessorKey: "studentName",
		header: "Estudiante",
		cell: ({ row }) => (
			<div className="flex items-center space-x-3">
				<div className="flex-shrink-0">
					<Users className="h-5 w-5 text-muted-foreground" />
				</div>
				<div className="min-w-0 flex-1">
					<p className="font-medium text-sm truncate">
						{row.original.studentName}
					</p>
				</div>
			</div>
		),
	},
	{
		accessorKey: "studentEmail",
		header: "Email",
		cell: ({ row }) => (
			<p className="text-xs text-muted-foreground">
				{row.original.studentEmail}
			</p>
		),
	},
	{
		accessorKey: "actions",
		header: "Acciones",
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
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleView}
					>
						<Eye className="h-4 w-4" />
						Ver
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handleEdit}
					>
						<Pencil className="h-4 w-4" />
						Editar
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={handleDelete}
					>
						<Trash className="h-4 w-4" />
						Eliminar
					</Button>
				</div>
			);
		},
	},
];
