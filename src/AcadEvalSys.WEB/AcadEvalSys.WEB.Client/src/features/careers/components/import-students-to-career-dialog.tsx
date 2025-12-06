"use client";
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

import { Separator } from "@/shared/components/ui/separator";
// removed unused X import
import { useImportStudentsToCareer, useBulkEnrollment } from "../hooks";
import { ImportStudentsResult } from "../models";
import { FileUpload } from "./file-upload";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { CareerYear, getCareerYearLabel } from "../models";
import {
  SelectedFileSection,
  FormatHelpSection,
  ImportResultSection,
} from "./import-dialog";

interface ImportStudentsToCareerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  careerId: string;
  careerName: string;
  careerYear: CareerYear;
}

export function ImportStudentsToCareerDialog({
  open,
  onOpenChange,
  careerId,
  careerName,
  careerYear,
}: ImportStudentsToCareerDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportStudentsResult | null>(
    null
  );
  const [showEnrollAllPrompt, setShowEnrollAllPrompt] = useState(false);

  const importMutation = useImportStudentsToCareer();
  const { isEnrollingAll, enrollAllImportedIntoAllSubjects } =
    useBulkEnrollment();

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setImportResult(null);
  }, []);

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      const result = await importMutation.mutateAsync({
        careerId,
        file: selectedFile,
      });
      setImportResult(result);
      // Mostrar prompt para inscribir a todas las asignaturas
      setShowEnrollAllPrompt(true);
    } catch {
      // Silently handle import errors
    }
  };

  const handleEnrollAll = async () => {
    await enrollAllImportedIntoAllSubjects(careerId, careerYear);
    setShowEnrollAllPrompt(false);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Estudiantes a la Carrera</DialogTitle>
          <DialogDescription>
            Importa estudiantes desde un archivo Excel a{" "}
            <strong>{careerName}</strong> para {getCareerYearLabel(careerYear)}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedFile && !importResult && (
            <FileUpload
              onFileSelect={handleFileSelect}
              accept=".xlsx"
              maxSizeMB={5}
              supportedFormats="Excel (.xlsx)"
            />
          )}

          {selectedFile && !importResult && (
            <>
              <SelectedFileSection
                selectedFile={selectedFile}
                onRemoveFile={() => setSelectedFile(null)}
              />
              <Separator />
              <FormatHelpSection />
            </>
          )}

          {importResult && (
            <ImportResultSection
              importResult={importResult}
              careerName={careerName}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {importResult ? "Cerrar" : "Cancelar"}
          </Button>

          {selectedFile && !importResult && (
            <Button onClick={handleImport} disabled={importMutation.isPending}>
              {importMutation.isPending
                ? "Importando..."
                : "Importar Estudiantes"}
            </Button>
          )}
        </DialogFooter>
        {/* Prompt para inscribir a todas las asignaturas */}
        {importResult && showEnrollAllPrompt && (
          <div className="mt-4">
            <ConfirmDialog
              title="Inscribir en todas las asignaturas"
              description={`Se importaron estudiantes a ${careerName}. ¿Deseas inscribirlos en todas las asignaturas de la tecnicatura?`}
              confirmText={isEnrollingAll ? "Inscribiendo..." : "Sí, inscribir"}
              cancelText="No, gracias"
              onConfirm={handleEnrollAll}
              trigger={
                <Button variant="secondary" disabled={isEnrollingAll}>
                  {isEnrollingAll ? "Inscribiendo..." : "Inscribir en todas"}
                </Button>
              }
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
