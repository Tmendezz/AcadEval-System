"use client";
import { ColumnDef } from "@tanstack/react-table";
import { SurveyListItem } from "@infrastructure/api/clients/survey-service";
import { Badge } from "@/shared/components/ui/badge";
import { Link } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { Eye } from "lucide-react";

export const surveyColumns: ColumnDef<SurveyListItem>[] = [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => (
      <Link href={`/surveys/${row.original.id}`}>
        <a className="font-medium text-primary hover:underline">{row.original.title}</a>
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
        Closed: "success",
        Draft: "secondary",
      }[status];
      return <Badge variant={variant as "default" | "secondary" | "destructive" | "outline"}>{status}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Creación",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "responseCount",
    header: "Respuestas",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/surveys/${row.original.id}`}>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Ver Resultados
        </Button>
      </Link>
    ),
  },
];
