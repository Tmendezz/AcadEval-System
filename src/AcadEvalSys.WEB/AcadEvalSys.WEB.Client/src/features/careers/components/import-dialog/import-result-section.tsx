import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { CheckCircle, AlertCircle, Users, Key, Download } from "lucide-react";
import { ImportStudentsResult } from "../../types";
import { usePasswordDownload } from "../../hooks/use-password-download";

interface ImportResultSectionProps {
  importResult: ImportStudentsResult;
  careerName: string;
}

export function ImportResultSection({
  importResult,
  careerName,
}: ImportResultSectionProps) {
  const { downloadPasswordsCSV } = usePasswordDownload();

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
          <div className="text-center p-3 bg-blue-50 rounded dark:bg-blue-950">
            <Users className="h-6 w-6 mx-auto text-blue-600 dark:text-blue-400 mb-1" />
            <p className="text-sm text-muted-foreground">Usuarios creados</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {usersCreated}
            </p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded dark:bg-green-950">
            <CheckCircle className="h-6 w-6 mx-auto text-green-600 dark:text-green-400 mb-1" />
            <p className="text-sm text-muted-foreground">
              Estudiantes agregados
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {studentsEnrolled}
            </p>
          </div>
        </div>

        {studentsAlreadyEnrolled > 0 && (
          <div className="text-center p-3 bg-yellow-50 rounded dark:bg-yellow-950">
            <AlertCircle className="h-6 w-6 mx-auto text-yellow-600 dark:text-yellow-400 mb-1" />
            <p className="text-sm text-muted-foreground">
              Ya estaban en la carrera
            </p>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
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
                onClick={() => downloadPasswordsCSV(importResult, careerName)}
              >
                <Download className="h-4 w-4 mr-1" />
                Descargar CSV
              </Button>
            </div>
            <div className="bg-muted rounded p-3 max-h-32 overflow-y-auto">
              {generatedPasswords.map((pwd, i) => (
                <div key={i} className="flex justify-between text-sm font-mono">
                  <span>{pwd.email}</span>
                  <span>{pwd.password}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasErrors && (
          <div>
            <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
              Errores ({errors.length})
            </h4>
            <div className="bg-red-50 dark:bg-red-950 rounded p-3 max-h-32 overflow-y-auto">
              {errors.map((error, i) => (
                <p key={i} className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
