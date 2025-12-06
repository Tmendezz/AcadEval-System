import { useState } from "react";
import { studentEvaluationsApi } from "../services";
import { toast } from "sonner";

export function useReportDownload() {
  const [downloading, setDownloading] = useState(false);

  const downloadReportToFile = async (reportId: string, fileName?: string) => {
    try {
      setDownloading(true);
      const blob = await studentEvaluationsApi.downloadReport(reportId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || `reporte_evaluacion_${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Reporte descargado exitosamente");
    } catch (error) {
      toast.error("Error al descargar el reporte");
      throw error;
    } finally {
      setDownloading(false);
    }
  };

  const openReportInNewTab = async (reportId: string) => {
    try {
      const downloadUrl = await studentEvaluationsApi.getReportDownloadUrl(
        reportId
      );
      window.open(downloadUrl.downloadUrl, "_blank");
      toast.success("Reporte abierto en nueva pestaña");
    } catch (error) {
      toast.error("Error al abrir el reporte");
      throw error;
    }
  };

  return {
    downloading,
    downloadReportToFile,
    openReportInNewTab,
  };
}
