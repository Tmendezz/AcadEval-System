import { useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Plus, BookOpen, Users, GraduationCap } from "lucide-react";
import { useGetTechnicalCareerById } from "../hooks/use-technical-careers";
import { useSubjectsByCareer } from "@/shared/hooks/use-subjects";
import { useParams } from "wouter";
import { navigate } from "wouter/use-browser-location";
import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { StatCard } from "@/shared/components/ui/stat-card";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { DataTable } from "@/shared/components/data-table/data-table";
import { createSubjectColumns } from "../columns";

export default function CareerSubjectsPage() {
  const { careerId } = useParams();

  if (!careerId) {
    return <div>Ruta no válida</div>;
  }

  const { data: career, isLoading: isLoadingCareer } =
    useGetTechnicalCareerById(careerId);
  const { data: subjects = [], isLoading: isLoadingSubjects } =
    useSubjectsByCareer(careerId, undefined, true);

  // Transform subjects to include technicalCareer property for careers-specific type

  const stats = useMemo(() => {
    const totalSubjects = subjects.length;
    const totalStudents = subjects.reduce(
      (sum, subject) => sum + (subject.enrolledStudents?.length || 0),
      0
    );
    const totalProfessors = subjects.filter((s) => s.professorId).length;
    const totalYears = 3;

    return {
      totalSubjects,
      totalStudents,
      totalProfessors,
      totalYears,
    };
  }, [subjects]);

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/administration/tecnicaturas/${careerId}/subjects/${subjectId}`);
  };

  const isLoading = isLoadingCareer || isLoadingSubjects;

  if (isLoading) {
    return <LoadingState message="Cargando carrera..." />;
  }

  if (!career) {
    return <div>No se encontró la carrera</div>;
  }

  return (
    <PageLayout>
      <PageHeader
        title={career.name}
        description={`Gestión de asignaturas de ${career.name}`}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/administration/tecnicaturas")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Asignatura
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        {/* Statistics Cards */}
        <PageSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Asignaturas"
              value={stats.totalSubjects}
              description="En esta carrera"
              icon={<BookOpen className="h-4 w-4" />}
            />
            <StatCard
              title="Total Estudiantes"
              value={stats.totalStudents}
              description="Inscritos en asignaturas"
              icon={<GraduationCap className="h-4 w-4" />}
            />
            <StatCard
              title="Total Profesores"
              value={stats.totalProfessors}
              description="Asignados a materias"
              icon={<Users className="h-4 w-4" />}
            />
            <StatCard
              title="Años Académicos"
              value={stats.totalYears}
              description="Por carrera"
              icon={<BookOpen className="h-4 w-4" />}
            />
          </div>
        </PageSection>

        {/* Subjects Table */}
        <PageSection>
          <DataTable
            columns={createSubjectColumns(careerId)}
            data={subjects}
            onRowClick={(subjectId) => handleSubjectClick(subjectId)}
          />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
