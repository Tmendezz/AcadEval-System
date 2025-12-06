import { ImportStudentsResult } from "../types";
import { toast } from "sonner";

export function usePasswordDownload() {
  const downloadPasswordsCSV = (
    importResult: ImportStudentsResult,
    careerName: string
  ) => {
    if (!importResult?.generatedPasswords.length) return;

    const csvContent = [
      "email,password",
      ...importResult.generatedPasswords.map((p) => `${p.email},${p.password}`),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contraseñas-${careerName}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Archivo CSV descargado exitosamente");
  };

  return {
    downloadPasswordsCSV,
  };
}
