import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge, badgeVariants } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { EvaluationFormData, Assignment } from "../../../types/evaluation-form";
import { useTechnicalCareers } from "@/shared/hooks/use-technical-careers";
import { useCompetencies } from "@/shared/hooks/use-competencies";
import {
  getYearName,
  groupAssignmentsByCareer,
} from "../../../utils/wizard-utils";

interface ReviewStepProps {
  formData: EvaluationFormData;
  assignments: Assignment[];
}

export function ReviewStep({ formData, assignments }: ReviewStepProps) {
  const { data: careers = [] } = useTechnicalCareers();
  const { data: competencies = [] } = useCompetencies();

  const groupedAssignments = groupAssignmentsByCareer(assignments);

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
              <p className="text-sm">
                {new Date(formData.periodFrom).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">
                Fecha de Fin
              </h4>
              <p className="text-sm">
                {new Date(formData.periodTo).toLocaleDateString()}
              </p>
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
                            <div key={year} className="ml-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="outline">
                                  {getYearName(year)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {yearAssignments.length} asignación
                                  {yearAssignments.length !== 1 ? "es" : ""}
                                </span>
                              </div>
                              <div className="space-y-2 ml-4">
                                {yearAssignments.map((assignment, index) => {
                                  const competency = competencies.find(
                                    (c) => c.id === assignment.competencyId
                                  );
                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                    >
                                      <div className="flex items-center gap-3">
                                        <Badge variant="outline">
                                          #{index + 1}
                                        </Badge>
                                        <div>
                                          <p className="font-medium">
                                            {competency?.name ||
                                              "Competencia no seleccionada"}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            Asignatura: {assignment.subjectId}
                                          </p>
                                        </div>
                                      </div>
                                      <Badge
                                        variant={
                                          competency?.type === "Soft"
                                            ? "secondary"
                                            : "default"
                                        }
                                      >
                                        {competency?.type === "Soft"
                                          ? "Blanda"
                                          : "Técnica"}
                                      </Badge>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
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
}
