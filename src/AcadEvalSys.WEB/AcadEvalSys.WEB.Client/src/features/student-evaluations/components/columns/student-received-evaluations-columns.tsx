import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import {  Download } from "lucide-react";
import type { StudentReceivedEvaluation } from "../../models";
import { studentEvaluationsApi } from "../../services/student-evaluations-service";

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
        <Button
          variant="outline"
          size="sm"
          disabled={!row.original.reportId}
          onClick={async () => {
            if (!row.original.reportId) return;
            const blob = await studentEvaluationsApi.downloadReport(
              row.original.reportId
            );
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reporte-${row.original.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          }}
        >
          <Download className="h-4 w-4" />
          Descargar
        </Button>
      </div>
    ),
  },
];
