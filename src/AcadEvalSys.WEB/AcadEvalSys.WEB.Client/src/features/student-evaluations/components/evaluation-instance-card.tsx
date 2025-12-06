import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Download, Calendar, FileText } from "lucide-react";
import type { StudentEvaluationInstance } from "../models";
import { studentEvaluationsApi } from "../services/student-evaluations-service";
import { toast } from "sonner";
import { useState } from "react";

interface EvaluationInstanceCardProps {
  instance: StudentEvaluationInstance;
}

export function EvaluationInstanceCard({ instance }: EvaluationInstanceCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadReport = async () => {
    if (!instance.reportId) {
      toast.error("No hay reporte disponible para esta instancia de evaluación");
      return;
    }

    try {
      setIsDownloading(true);
      const blob = await studentEvaluationsApi.downloadReport(instance.reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-${instance.title.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Reporte descargado exitosamente");
    } catch {
      toast.error("Error al descargar el reporte");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{instance.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {instance.description}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(instance.periodFrom).toLocaleDateString()} -{" "}
                {new Date(instance.periodTo).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Competencias evaluadas:</span>
              <span className="font-medium">
                {instance.completedCompetencies} de {instance.totalCompetencies}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Progreso:</span>
              <span className="font-medium">{instance.progressPercentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="ml-4">
          <Button
            onClick={handleDownloadReport}
            disabled={!instance.reportId || isDownloading}
            variant={instance.reportId ? "default" : "outline"}
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading
              ? "Descargando..."
              : instance.reportId
              ? "Descargar Reporte"
              : "Sin Reporte"}
          </Button>
          {!instance.reportId && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              El reporte estará disponible una vez finalizada la evaluación
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${instance.progressPercentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
}

