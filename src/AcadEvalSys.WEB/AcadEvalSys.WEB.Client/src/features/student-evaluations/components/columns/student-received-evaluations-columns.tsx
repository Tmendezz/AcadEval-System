import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import { Link } from "wouter";
import { Eye, Target } from "lucide-react";
import type { StudentReceivedEvaluation } from "@infrastructure/api/clients/student-evaluation-service";

export const studentReceivedEvaluationColumns: ColumnDef<StudentReceivedEvaluation>[] = [
  {
    accessorKey: "evaluationInstanceTitle",
    header: "Evaluación",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.evaluationInstanceTitle}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.evaluationInstanceDescription}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "assessmentDate",
    header: "Fecha",
    cell: ({ row }) => {
      if (row.original.assessmentDate) {
        return new Date(row.original.assessmentDate).toLocaleDateString();
      }
      return <span className="text-muted-foreground">-</span>;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/estudiante/evaluaciones/${row.original.id}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Ver Detalle
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="gap-2">
          <Target className="w-4 h-4" />
          Descargar PDF
        </Button>
      </div>
    ),
  },
];


