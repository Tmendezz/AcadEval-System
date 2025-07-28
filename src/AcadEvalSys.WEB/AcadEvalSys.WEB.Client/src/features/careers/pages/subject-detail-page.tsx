import { useQuery } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import {
  ArrowLeft,
  Users,
  GraduationCap,
  Plus,
  UserPlus,
  Pencil,
} from "lucide-react";

import { EnrolledStudent } from "@/shared/types";
import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { DataTable } from "@/shared/components/data-table/data-table";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { studentColumns } from "../columns";
import { useSubject, useSubjectsByYear } from "../hooks";
import { useParams } from "wouter";
import { navigate } from "wouter/use-browser-location";

export default function SubjectDetailPage() {
  const { careerId, subjectId } = useParams();

  const { subject, isLoadingSubject } = useSubject(subjectId!, careerId!);

  if (isLoadingSubject) {
    return (
      <PageLayout>
        <LoadingState message="Cargando detalles de la asignatura..." />
      </PageLayout>
    );
  }

  if (!subject) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-semibold mb-2">
            Asignatura no encontrada
          </h2>
          <p className="text-muted-foreground mb-4">
            La asignatura que buscas no existe o no tienes permisos para verla.
          </p>
          <Button
            onClick={() => navigate(`/administration/tecnicaturas/${careerId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Carreras
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={subject.name}
        description={`Detalles de la asignatura ${subject.name} - ${subject.year}`}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/administration/tecnicaturas/${careerId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Inscribir Estudiante
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        <PageSection>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Profesor Asignado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subject.professorName ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{subject.professorName}</p>
                  </div>
                  {subject.professorId ? (
                    <Button variant="outline" size="sm">
                      <Pencil className="w-4 h-4 mr-2" />
                      Cambiar Profesor
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Asignar Profesor
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground text-center">
                    No hay profesor asignado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </PageSection>

        {/* Lista de Estudiantes */}
        <PageSection>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Estudiantes Inscritos</h3>
            <Badge variant="outline">
              {subject.enrolledStudents?.length} estudiantes
            </Badge>
          </div>

          {subject.enrolledStudents && subject.enrolledStudents.length > 0 ? (
            <DataTable
              columns={studentColumns}
              data={subject.enrolledStudents}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No hay estudiantes inscritos
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Esta asignatura aún no tiene estudiantes inscritos.
                </p>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Inscribir Primer Estudiante
                </Button>
              </CardContent>
            </Card>
          )}
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
