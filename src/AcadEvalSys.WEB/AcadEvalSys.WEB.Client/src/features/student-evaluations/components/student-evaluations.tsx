import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { useEvaluationInstances } from "../hooks/use-evaluation-instances";
import { useEvaluations } from "../hooks/use-evaluations";
import { useReportDownload } from "../hooks/use-report-download";
import { EvaluationInstancesList } from "./evaluation-instance-list";
import { EvaluationsPanel } from "./evaluations-panel";
import { StudentEvaluationInstance } from "../models";

export function StudentEvaluations() {
  const { data: instances, isLoading: loadingInstances } =
    useEvaluationInstances();
  const [selectedInstance, setSelectedInstance] =
    useState<StudentEvaluationInstance | null>(null);
  const { data: evaluations, isLoading: loadingEvaluations } = useEvaluations(
    selectedInstance?.id
  );
  const { downloadReportToFile, openReportInNewTab } = useReportDownload();

  useEffect(() => {
    if (instances && instances.length > 0 && !selectedInstance) {
      setSelectedInstance(instances[0]);
    }
  }, [instances, selectedInstance]);

  const handleInstanceSelect = (instance: StudentEvaluationInstance) => {
    setSelectedInstance(instance);
  };

  const handleDownloadReport = (reportId: string) => {
    downloadReportToFile(reportId);
  };

  const handleOpenReport = (reportId: string) => {
    openReportInNewTab(reportId);
  };

  if (loadingInstances) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando evaluaciones...</p>
        </div>
      </div>
    );
  }

  if (!instances || instances.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          No hay evaluaciones disponibles
        </h3>
        <p className="text-muted-foreground">
          Aún no tienes evaluaciones de competencia asignadas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mis Evaluaciones de Competencia
          </h1>
          <p className="text-muted-foreground">
            Revisa tus evaluaciones de competencia y descarga los reportes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de instancias de evaluación */}
        <div className="lg:col-span-1">
          <EvaluationInstancesList
            instances={instances}
            selectedInstance={selectedInstance}
            onInstanceSelect={handleInstanceSelect}
          />
        </div>

        {/* Panel de evaluaciones */}
        <div className="lg:col-span-2">
          <EvaluationsPanel
            selectedInstance={selectedInstance}
            evaluations={evaluations || []}
            loading={loadingEvaluations}
            onDownloadReport={handleDownloadReport}
            onOpenReport={handleOpenReport}
          />
        </div>
      </div>
    </div>
  );
}
