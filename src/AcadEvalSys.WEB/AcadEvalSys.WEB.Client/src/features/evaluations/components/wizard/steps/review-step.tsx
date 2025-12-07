import { memo, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { EvaluationFormData, Assignment } from "@/features/evaluations/models/evaluation-form";
import { useTechnicalCareers } from "@/shared/hooks/use-technical-careers";
import { useCompetencies } from "@/features/competencies/hooks/use-competencies";
import { useSubjectsByCareer } from "@/shared/hooks/use-subjects";
import {
  getYearName,
  groupAssignmentsByCareer,
} from "../../../utils/wizard-utils";

interface ReviewStepProps {
  formData: EvaluationFormData;
  assignments: Assignment[];
}

// Componente interno para obtener asignaturas por carrera y año
function CareerYearSubjects({
  careerId,
  year,
  assignments,
  competencyMap,
}: {
  careerId: string;
  year: number;
  assignments: Assignment[];
  competencyMap: Map<string, { name: string; type: "Soft" | "Technical" }>;
}) {
  const { data: subjects = [] } = useSubjectsByCareer(careerId, year.toString(), false);
  const subjectMap = useMemo(
    () => new Map(subjects.map((s) => [s.id, s.name])),
    [subjects]
  );

  return (
    <div className="ml-4">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline">
          {getYearName(year)}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {assignments.length} asignación
          {assignments.length !== 1 ? "es" : ""}
        </span>
      </div>
      <div className="space-y-2 ml-4">
        {assignments.map((assignment, index) => {
          const competency = competencyMap.get(assignment.competencyId);
          const subjectName = subjectMap.get(assignment.subjectId) || assignment.subjectId;
          return (
            <div
              key={`${assignment.competencyId}-${assignment.subjectId}-${index}`}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline">#{index + 1}</Badge>
                <div>
                  <p className="font-medium">
                    {competency?.name || "Competencia no seleccionada"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Asignatura: {subjectName}
                  </p>
                </div>
              </div>
              <Badge
                variant={competency?.type === "Soft" ? "secondary" : "default"}
              >
                {competency?.type === "Soft" ? "Blanda" : "Técnica"}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ReviewStep = memo(function ReviewStep({
  formData,
  assignments,
}: ReviewStepProps) {
  const { data: careers = [] } = useTechnicalCareers();
  const { data: competencies = [] } = useCompetencies();

  // Memoizar agrupamiento de asignaciones
  const groupedAssignments = useMemo(
    () => groupAssignmentsByCareer(assignments),
    [assignments]
  );

  // Memoizar mapeo de competencias por ID para búsqueda rápida
  const competencyMap = useMemo(
    () => new Map(competencies.map((c) => [c.id, c])),
    [competencies]
  );

  // Memoizar formateo de fechas
  const formattedDates = useMemo(
    () => ({
      periodFrom: new Date(formData.periodFrom).toLocaleDateString(),
      periodTo: new Date(formData.periodTo).toLocaleDateString(),
    }),
    [formData.periodFrom, formData.periodTo]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                Título
              </h4>
              <p className="text-lg">{formData.title}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                Semestre
              </h4>
              <Badge variant="outline">
                {formData.semester === "First"
                  ? "Primer Semestre"
                  : "Segundo Semestre"}
              </Badge>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Descripción
              </h4>
              <p className="text-sm">{formData.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                Fecha de Inicio
              </h4>
              <p className="text-sm">{formattedDates.periodFrom}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                Fecha de Fin
              </h4>
              <p className="text-sm">{formattedDates.periodTo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Asignaciones por Carrera</CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <p className="text-muted-foreground">
              No hay asignaciones configuradas
            </p>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedAssignments).map(([careerId, years]) => {
                const career = careers.find((c) => c.id === careerId);
                return (
                  <div key={careerId} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-4">
                      {career?.name}
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(years).map(
                        ([yearStr, yearAssignments]) => {
                          const year = parseInt(yearStr);
                          return (
                            <CareerYearSubjects
                              key={year}
                              careerId={careerId}
                              year={year}
                              assignments={yearAssignments}
                              competencyMap={competencyMap}
                            />
                          );
                        }
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
