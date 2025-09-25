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
import { AdminFormDialog } from "../components/admin-form-dialog";
import { ProfessorFormDialog } from "../components/professor-form-dialog";
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
import { navigate } from "wouter/use-browser-location";

export default function PersonalPage() {
  // Hooks modulares para operaciones
  const adminOps = useAdminOperations();
  const professorOps = useProfessorOperations();
  const studentOps = useStudentOperations();
  const careerOps = useCareerOperations();

  // Log de depuración para detectar por qué no hay admins
  if (!adminOps.isLoadingProfessors && adminOps.admins.length === 0) {
    console.log("[AdminList] Lista de administradores vacía", {
      userInfo: "Se espera que el usuario actual sea Admin",
    });
  }

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
              columns={careerColumns({
                onEdit: careerOps.handleEditCareer,
                onDelete: careerOps.handleDeleteCareer,
                onView: careerOps.handleViewCareer,
              })}
              isLoading={careerOps.isLoadingCareers}
              emptyMessage="No se encontraron carreras"
              emptyIcon={<Building2 className="w-8 h-8" />}
              className="mb-6"
              headerActions={
                <Button onClick={() => navigate("/carreras/nueva")}>
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
              columns={professorColumns({
                onEdit: professorOps.handleEditProfessor,
                onDelete: professorOps.handleDeleteProfessor,
              })}
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
              columns={studentColumns({
                onEdit: studentOps.handleEditStudent,
                onDelete: studentOps.handleDeleteStudent,
              })}
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
              columns={adminColumns({
                onEdit: adminOps.handleEditAdmin,
                onDelete: adminOps.handleDeleteAdmin,
              })}
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
        onSubmit={async (values) => {
          if (adminOps.selectedAdmin) {
            await adminOps.updateAdmin.mutateAsync(values);
          } else {
            await adminOps.createAdmin.mutateAsync(values);
          }
          adminOps.setIsAdminDialogOpen(false);
        }}
      />

      <ProfessorFormDialog
        open={professorOps.isProfessorDialogOpen}
        onOpenChange={professorOps.setIsProfessorDialogOpen}
        professor={professorOps.selectedProfessor}
        onSubmit={async (values) => {
          if (professorOps.selectedProfessor) {
            await professorOps.updateProfessor.mutateAsync(values);
          } else {
            await professorOps.createProfessor.mutateAsync(values);
          }
          professorOps.setIsProfessorDialogOpen(false);
        }}
      />

      <StudentFormDialog
        open={studentOps.isStudentDialogOpen}
        onOpenChange={studentOps.setIsStudentDialogOpen}
        student={studentOps.selectedStudent}
        onSubmit={async (values) => {
          if (studentOps.selectedStudent) {
            await studentOps.updateStudent.mutateAsync(values);
          } else {
            await studentOps.createStudent.mutateAsync(values);
          }
          studentOps.setIsStudentDialogOpen(false);
        }}
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
