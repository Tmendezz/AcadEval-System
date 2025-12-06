import { useCallback, useMemo } from "react";
import {
  PageLayout,
  PageContent,
} from "@/shared/components/layout/page-layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { DataSection } from "@/shared/components/ui/data-section";
import { User, UserPlus, Building2, Plus, GraduationCap } from "lucide-react";
import { AdminFormDialog, AdminFormValues } from "../components/admin-form-dialog";
import { ProfessorFormDialog, ProfessorFormValues } from "../components/professor-form-dialog";
import { StudentFormDialog } from "../components/student-form-dialog";
import { ProfessorAssignmentsModal } from "../components/professor-assignments-modal";
import { adminColumns } from "../columns/admin-columns";
import { professorColumns } from "../columns/professor-columns";
import { studentColumns } from "../columns/student-columns";
import { careerColumns } from "../columns/career-columns";
import { useAdminOperations } from "../hooks/use-admin-operations";
import { useProfessorOperations } from "../hooks/use-professor-operations";
import { useStudentOperations } from "../hooks/use-student-operations";
import { useCareerOperations } from "../hooks/use-career-operations";
import { StudentFormValues } from "../services/student-service";
import { navigate } from "wouter/use-browser-location";

export default function PersonalPage() {
  // Hooks modulares para operaciones
  const adminOps = useAdminOperations();
  const professorOps = useProfessorOperations();
  const studentOps = useStudentOperations();
  const careerOps = useCareerOperations();

  // Memoizar columnas para evitar re-renders innecesarios
  const memoizedCareerColumns = useMemo(
    () =>
      careerColumns({
        onEdit: careerOps.handleEditCareer,
        onDelete: careerOps.handleDeleteCareer,
        onView: careerOps.handleViewCareer,
      }),
    [careerOps.handleEditCareer, careerOps.handleDeleteCareer, careerOps.handleViewCareer]
  );

  const memoizedProfessorColumns = useMemo(
    () =>
      professorColumns({
        onEdit: professorOps.handleEditProfessor,
        onDelete: professorOps.handleDeleteProfessor,
      }),
    [professorOps.handleEditProfessor, professorOps.handleDeleteProfessor]
  );

  const memoizedStudentColumns = useMemo(
    () =>
      studentColumns({
        onEdit: studentOps.handleEditStudent,
        onDelete: studentOps.handleDeleteStudent,
      }),
    [studentOps.handleEditStudent, studentOps.handleDeleteStudent]
  );

  const memoizedAdminColumns = useMemo(
    () =>
      adminColumns({
        onEdit: adminOps.handleEditAdmin,
        onDelete: adminOps.handleDeleteAdmin,
      }),
    [adminOps.handleEditAdmin, adminOps.handleDeleteAdmin]
  );

  // Handlers memoizados para formularios
  const handleNavigateToNewCareer = useCallback(() => {
    navigate("/carreras/nueva");
  }, []);

  const handleAdminSubmit = useCallback(
    async (values: AdminFormValues) => {
      if (adminOps.selectedAdmin) {
        await adminOps.updateAdmin.mutateAsync(values);
      } else {
        await adminOps.createAdmin.mutateAsync(values);
      }
      adminOps.setIsAdminDialogOpen(false);
    },
    [adminOps.selectedAdmin, adminOps.updateAdmin, adminOps.createAdmin, adminOps.setIsAdminDialogOpen]
  );

  const handleProfessorSubmit = useCallback(
    async (values: ProfessorFormValues) => {
      if (professorOps.selectedProfessor) {
        await professorOps.updateProfessor.mutateAsync(values);
      } else {
        await professorOps.createProfessor.mutateAsync(values);
      }
      professorOps.setIsProfessorDialogOpen(false);
    },
    [professorOps.selectedProfessor, professorOps.updateProfessor, professorOps.createProfessor, professorOps.setIsProfessorDialogOpen]
  );

  const handleStudentSubmit = useCallback(
    async (values: StudentFormValues) => {
      if (studentOps.selectedStudent) {
        await studentOps.updateStudent.mutateAsync(values);
      } else {
        await studentOps.createStudent.mutateAsync(values);
      }
      studentOps.setIsStudentDialogOpen(false);
    },
    [studentOps.selectedStudent, studentOps.updateStudent, studentOps.createStudent, studentOps.setIsStudentDialogOpen]
  );

  return (
    <PageLayout>
      <PageContent>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Administración
            </h1>
            <p className="text-muted-foreground">
              Gestión de personal, carreras y usuarios del sistema
            </p>
          </div>
        </div>

        <Tabs defaultValue="carreras" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="carreras">Carreras</TabsTrigger>
            <TabsTrigger value="profesores">Profesores</TabsTrigger>
            <TabsTrigger value="estudiantes">Estudiantes</TabsTrigger>
            <TabsTrigger value="administradores">Administradores</TabsTrigger>
          </TabsList>

          <TabsContent value="carreras" className="mt-6">
            <DataSection
              title="Carreras Técnicas"
              description="Crear, editar y eliminar carreras técnicas"
              data={careerOps.careers}
              columns={memoizedCareerColumns}
              isLoading={careerOps.isLoadingCareers}
              emptyMessage="No se encontraron carreras"
              emptyIcon={<Building2 className="w-8 h-8" />}
              className="mb-6"
              headerActions={
                <Button onClick={handleNavigateToNewCareer}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva carrera
                </Button>
              }
            />
          </TabsContent>

          <TabsContent value="profesores" className="mt-6">
            <DataSection
              title="Gestión de Profesores"
              description="Crear, editar y eliminar profesores"
              data={professorOps.professors}
              columns={memoizedProfessorColumns}
              isLoading={professorOps.isLoadingProfessorList}
              emptyMessage="No se encontraron profesores"
              emptyIcon={<User className="w-8 h-8" />}
              className="mb-6"
              headerActions={
                <Button onClick={professorOps.handleNewProfessorClick}>
                  <User className="w-4 h-4 mr-2" />
                  Nuevo Profesor
                </Button>
              }
            />
          </TabsContent>

          <TabsContent value="estudiantes" className="mt-6">
            <DataSection
              title="Gestión de Estudiantes"
              description="Crear, editar y eliminar estudiantes"
              data={studentOps.students}
              columns={memoizedStudentColumns}
              isLoading={studentOps.isLoadingStudents}
              emptyMessage="No se encontraron estudiantes"
              emptyIcon={<GraduationCap className="w-8 h-8" />}
              className="mb-6"
              headerActions={
                <Button onClick={studentOps.handleNewStudentClick}>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Nuevo Estudiante
                </Button>
              }
            />
          </TabsContent>

          <TabsContent value="administradores" className="mt-6">
            <DataSection
              title="Administradores del Sistema"
              description="Gestión de usuarios administradores"
              data={adminOps.admins}
              columns={memoizedAdminColumns}
              isLoading={adminOps.isLoadingProfessors}
              emptyMessage="No se encontraron administradores"
              emptyIcon={<UserPlus className="w-8 h-8" />}
              className="mb-6"
              headerActions={
                <Button onClick={adminOps.handleNewAdminClick}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nuevo Administrador
                </Button>
              }
            />
          </TabsContent>
        </Tabs>
      </PageContent>

      <AdminFormDialog
        open={adminOps.isAdminDialogOpen}
        onOpenChange={adminOps.setIsAdminDialogOpen}
        administrator={adminOps.selectedAdmin}
        onSubmit={handleAdminSubmit}
      />

      <ProfessorFormDialog
        open={professorOps.isProfessorDialogOpen}
        onOpenChange={professorOps.setIsProfessorDialogOpen}
        professor={professorOps.selectedProfessor}
        onSubmit={handleProfessorSubmit}
      />

      <StudentFormDialog
        open={studentOps.isStudentDialogOpen}
        onOpenChange={studentOps.setIsStudentDialogOpen}
        student={studentOps.selectedStudent}
        onSubmit={handleStudentSubmit}
        onChangePassword={studentOps.handleChangeStudentPassword}
      />

      <ProfessorAssignmentsModal
        open={professorOps.isAssignmentsModalOpen}
        onOpenChange={professorOps.setIsAssignmentsModalOpen}
        professorName={professorOps.selectedProfessor?.name || ""}
        assignedSubjects={professorOps.professorAssignments}
        onConfirm={professorOps.handleCloseAssignmentsModal}
        onCancel={professorOps.handleCloseAssignmentsModal}
      />
    </PageLayout>
  );
}
