"use client";
import { ColumnDef } from "@tanstack/react-table";
import { EvaluationListItem } from "@infrastructure/api/clients/evaluation-service";
import { Badge } from "@/shared/components/ui/badge";
import { Link } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { Eye } from "lucide-react";

export const evaluationColumns: ColumnDef<EvaluationListItem>[] = [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <Link href={`/evaluaciones/${row.original.id}`}>
        <span className="font-medium text-primary hover:underline cursor-pointer">
          {row.original.title}
        </span>
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = {
        Published: "default",
        Completed: "success",
        Draft: "secondary",
        Archived: "outline",
      }[status];
      return (
        <Badge
          variant={
            variant as "default" | "secondary" | "destructive" | "outline"
          }
        >
          {status}
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
    cell: ({ row }) => (
      <Link href={`/evaluaciones/${row.original.id}`}>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Ver Detalles
        </Button>
      </Link>
    ),
  },
];
