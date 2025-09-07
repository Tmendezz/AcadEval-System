import { Download, FileText, Award, User } from "lucide-react";
import {
  StudentEvaluationInstance,
  StudentReceivedEvaluation,
} from "../models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";

interface EvaluationsPanelProps {
  selectedInstance: StudentEvaluationInstance | null;
  evaluations: StudentReceivedEvaluation[];
  loading: boolean;
  onDownloadReport: (reportId: string) => void;
  onOpenReport: (reportId: string) => void;
}

export function EvaluationsPanel({
  selectedInstance,
  evaluations,
  loading,
  onDownloadReport,
  onOpenReport,
}: EvaluationsPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "Completed":
        return "bg-green-100 text-green-800";
      case "pending":
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
      case "InProgress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCompetencyLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "Inicial":
        return "bg-blue-100 text-blue-800";
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800";
      case "avanzado":
        return "bg-green-100 text-green-800";
      case "Excelente":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!selectedInstance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Evaluaciones de Competencia
          </CardTitle>
          <CardDescription>
            Selecciona una instancia para ver las evaluaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Selecciona una instancia de evaluación para ver tus resultados
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Evaluaciones de Competencia
          </CardTitle>
          <CardDescription>
            Evaluaciones de: {selectedInstance.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (evaluations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Evaluaciones de Competencia
          </CardTitle>
          <CardDescription>
            Evaluaciones de: {selectedInstance.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron evaluaciones para esta instancia
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Evaluaciones de Competencia
        </CardTitle>
        <CardDescription>
          Evaluaciones de: {selectedInstance.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Resumen de la instancia */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {evaluations.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Evaluaciones
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {
                    evaluations.filter(
                      (e) =>
                        e.status.toLowerCase() === "Completed" ||
                        e.status.toLowerCase() === "completado"
                    ).length
                  }
                </div>
                <div className="text-xs text-muted-foreground">Completadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {
                    evaluations.filter((e) => {
                      const level = e.competencyLevel?.toLowerCase();
                      return level === "avanzado" || level === "excelente";
                    }).length
                  }
                </div>
                <div className="text-xs text-muted-foreground">Nivel Alto</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {selectedInstance.hasReport ? "Sí" : "No"}
                </div>
                <div className="text-xs text-muted-foreground">Reporte PDF</div>
              </div>
            </div>
          </div>

          {/* Botón de descarga del reporte si está disponible */}
          {selectedInstance.hasReport && selectedInstance.reportId && (
            <div className="flex gap-2">
              <Button
                onClick={() => onDownloadReport(selectedInstance.reportId!)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Descargar Reporte PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenReport(selectedInstance.reportId!)}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Ver en Navegador
              </Button>
            </div>
          )}

          <Separator />

          {/* Lista de evaluaciones */}
          <div className="space-y-3">
            {evaluations.map((evaluation) => (
              <div
                key={evaluation.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {evaluation.competencyName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {evaluation.subjectName} - {evaluation.professorName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(evaluation.status)}>
                    {evaluation.status}
                  </Badge>
                  <Badge
                    className={getCompetencyLevelColor(
                      evaluation.competencyLevel ?? "Ninguno"
                    )}
                  >
                    {evaluation.competencyLevel ?? "Sin evaluar"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
