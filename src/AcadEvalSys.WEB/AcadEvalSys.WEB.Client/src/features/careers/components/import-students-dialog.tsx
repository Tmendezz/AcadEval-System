"use client";
import React, { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  Key,
  Download,
  X,
} from "lucide-react";
import { useImportStudents } from "../hooks";
import { ImportStudentsResult } from "@/features/careers";
import { toast } from "sonner";

interface ImportStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  careerId: string;
  subjectId: string;
  subjectName: string;
}

export function ImportStudentsDialog({
  open,
  onOpenChange,
  careerId,
  subjectId,
  subjectName,
}: ImportStudentsDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportStudentsResult | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importMutation = useImportStudents();

  const validateAndSetFile = useCallback((file: File) => {
    const allowedTypes = [".csv", ".xlsx", ".xls"]; // CSV o Excel
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      toast.error(
        "Tipo de archivo no permitido. Use CSV o Excel (.xlsx, .xls)"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo es demasiado grande. Máximo 5MB");
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
  }, []);

  const handleFileSelected = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        validateAndSetFile(e.target.files[0]);
      }
    },
    [validateAndSetFile]
  );

  const handleOpenPicker = useCallback(() => {
    // No preventDefault/stopPropagation para preservar la user activation
    const input = fileInputRef.current as HTMLInputElement;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
        return;
      } catch {
        // Fallback to click if showPicker fails
      }
    }
    input.click();
  }, []);

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      const result = await importMutation.mutateAsync({
        careerId,
        subjectId,
        file: selectedFile,
      });
      setImportResult(result);
    } catch (error) {
      console.error("Error importing students:", error);
    }
  };

  const downloadPasswordsCSV = () => {
    if (!importResult?.generatedPasswords.length) return;

    const csvContent = [
      "email,password",
      ...importResult.generatedPasswords.map((p) => `${p.email},${p.password}`),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contraseñas-${subjectName}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    onOpenChange(false);
  };

  const renderSelectedFile = () => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          Archivo seleccionado
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{selectedFile?.name}</p>
            <p className="text-sm text-gray-500">
              {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFile(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderFormatHelp = () => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Formato requerido</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            El archivo CSV debe tener las siguientes columnas:
          </p>
          <div className="bg-gray-50 p-3 rounded font-mono text-sm">
            email,name,password
            <br />
            juan.perez@ejemplo.com,Juan Pérez,
            <br />
            maria.gonzalez@ejemplo.com,María González,MiPassword123!
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <strong>email:</strong> Email único del estudiante (requerido)
            </li>
            <li>
              • <strong>name:</strong> Nombre completo (requerido)
            </li>
            <li>
              • <strong>password:</strong> Contraseña opcional (se genera
              automáticamente si se omite)
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  const renderImportResult = () => {
    if (!importResult) return null;

    const {
      usersCreated,
      studentsEnrolled,
      studentsAlreadyEnrolled,
      errors,
      generatedPasswords,
    } = importResult;
    const hasErrors = errors.length > 0;

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            {hasErrors ? (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            Resultado de la importación
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded">
              <Users className="h-6 w-6 mx-auto text-blue-600 mb-1" />
              <p className="text-sm text-gray-600">Usuarios creados</p>
              <p className="text-xl font-bold text-blue-600">{usersCreated}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-1" />
              <p className="text-sm text-gray-600">Alumnos inscritos</p>
              <p className="text-xl font-bold text-green-600">
                {studentsEnrolled}
              </p>
            </div>
          </div>

          {studentsAlreadyEnrolled > 0 && (
            <div className="text-center p-3 bg-yellow-50 rounded">
              <AlertCircle className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
              <p className="text-sm text-gray-600">Ya estaban inscritos</p>
              <p className="text-xl font-bold text-yellow-600">
                {studentsAlreadyEnrolled}
              </p>
            </div>
          )}

          {generatedPasswords.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Contraseñas generadas ({generatedPasswords.length})
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPasswordsCSV}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Descargar CSV
                </Button>
              </div>
              <div className="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                {generatedPasswords.map((pwd, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm font-mono"
                  >
                    <span>{pwd.email}</span>
                    <span>{pwd.password}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasErrors && (
            <div>
              <h4 className="font-medium text-red-600 mb-2">
                Errores ({errors.length})
              </h4>
              <div className="bg-red-50 rounded p-3 max-h-32 overflow-y-auto">
                {errors.map((error, i) => (
                  <p key={i} className="text-sm text-red-700">
                    {error}
                  </p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inscribir Alumnos</DialogTitle>
          <DialogDescription>
            Inscribe alumnos desde un archivo CSV o Excel a la materia{" "}
            <strong>{subjectName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedFile && !importResult && (
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer hover:border-gray-400"
              onClick={handleOpenPicker}
            >
              <p className="text-lg font-medium text-gray-700 mb-2">
                Arrastra tu archivo aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Formato soportado: CSV - Máximo 5MB
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelected}
                className="sr-only"
              />

              <button
                type="button"
                onClick={handleOpenPicker}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Seleccionar archivo
              </button>
            </div>
          )}

          {selectedFile && !importResult && (
            <>
              {renderSelectedFile()}
              <Separator />
              {renderFormatHelp()}
            </>
          )}

          {importResult && renderImportResult()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {importResult ? "Cerrar" : "Cancelar"}
          </Button>

          {selectedFile && !importResult && (
            <Button onClick={handleImport} disabled={importMutation.isPending}>
              {importMutation.isPending
                ? "Inscribiendo..."
                : "Inscribir Alumnos"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
