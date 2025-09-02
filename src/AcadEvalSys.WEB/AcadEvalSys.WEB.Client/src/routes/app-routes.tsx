import { Route, Switch } from "wouter";
import { AppLayout } from "../shared/components/layout";
import { DashboardPage } from "../features/dashboard";
import {
  CompetenciesPage,
  EvaluationsPage,
  CompetencyDetailPage,
  CreateEvaluationPage,
  ProfessorAllEvaluationsPage,
  AssignmentDetailPage,
  EvaluationToCompleteDetailPage,
  EvaluateStudentsPage,
  StudentEvaluationDetailPage,
} from "../features/evaluations";
import StudentReceivedEvaluationsPage from "../features/evaluations/pages/student-received-evaluations-page";
import EvaluationDetailPage from "../features/evaluations/pages/evaluation-detail-page";
import CareerYearDetailPage from "../features/evaluations/pages/career-year-detail-page";
import {
  CreateSurveyPage,
  SurveysPage,
  TemplatesPage,
} from "../features/surveys";
import { PersonalPage } from "../features/administration";
import { SubjectDetailPage, SubjectsPage } from "../features/careers";
import CreateTechnicalCareerPage from "@/features/careers/pages/create-technical-career-page";
import EditTechnicalCareerPage from "@/features/careers/pages/edit-technical-career-page";
import StudentEvaluationsPage from "@/features/student-dashboard/pages/student-evaluations-page";
import { AdminRoute, ProtectedRoute } from "../features/auth/components";
import { UserRole } from "@/shared/types/auth";

export function AppRoutes() {
  return (
    <AppLayout>
      <Switch>
        {/* Encuestas academicas*/}
        <Route path="/" component={DashboardPage} />
        <Route path="/surveys" component={SurveysPage} />
        <Route path="/surveys/templates" component={TemplatesPage} />
        <Route path="/surveys/new" component={CreateSurveyPage} />

        {/* Evaluaciones - Acceso general para ver */}
        <Route path="/evaluaciones/competencias" component={CompetenciesPage} />
        <Route path="/evaluaciones" component={EvaluationsPage} />
        <Route
          path="/evaluaciones/competencias/:id"
          component={CompetencyDetailPage}
        />

        {/* RUTAS ESPECÍFICAS DEBEN IR ANTES QUE LAS GENÉRICAS */}
        <Route path="/evaluaciones/nueva">
          <CreateEvaluationPage />
        </Route>
        <Route path="/evaluaciones/docentes/mis-evaluaciones/:assignmentId">
          <ProtectedRoute requiredRoles={[UserRole.Professor]}>
            <EvaluateStudentsPage />
          </ProtectedRoute>
        </Route>
        {/* Rutas específicas para docentes */}
        <Route path="/evaluaciones/docentes/mis-evaluaciones">
          <ProtectedRoute requiredRoles={[UserRole.Professor]}>
            <ProfessorAllEvaluationsPage />
          </ProtectedRoute>
        </Route>

        {/* Rutas específicas para alumnos */}
        <Route path="/evaluaciones/alumnos/mis-evaluaciones">
          <ProtectedRoute requiredRoles={[UserRole.Student]}>
            <StudentReceivedEvaluationsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/evaluaciones/alumnos/mis-evaluaciones/:evaluationId">
          <ProtectedRoute requiredRoles={[UserRole.Student]}>
            <StudentEvaluationDetailPage />
          </ProtectedRoute>
        </Route>
        <Route path="/evaluaciones/asignacion/:assignmentId">
          <ProtectedRoute requiredRoles={[UserRole.Professor]}>
            <AssignmentDetailPage />
          </ProtectedRoute>
        </Route>
        <Route path="/evaluaciones/:evaluationId/asignacion/:assignmentId">
          <ProtectedRoute requiredRoles={[UserRole.Professor]}>
            <EvaluationToCompleteDetailPage />
          </ProtectedRoute>
        </Route>

        {/* Evaluaciones del estudiante - Solo para estudiantes */}
        <Route path="/estudiante/evaluaciones">
          <ProtectedRoute requiredRoles={[UserRole.Student]}>
            <StudentEvaluationsPage />
          </ProtectedRoute>
        </Route>

        {/* RUTAS GENÉRICAS VAN AL FINAL */}
        <Route path="/evaluaciones/:id" component={EvaluationDetailPage} />
        <Route
          path="/evaluaciones/:evaluationId/carrera/:careerId/año/:year"
          component={CareerYearDetailPage}
        />

        {/* Carreras - Solo para administradores y coordinadores */}
        <Route path="/tecnicaturas/nueva">
          <CreateTechnicalCareerPage />
        </Route>
        <Route path="/tecnicaturas/:careerId/editar">
          <EditTechnicalCareerPage />
        </Route>

        {/* Carreras - Acceso general para ver */}
        <Route path="/tecnicaturas/:careerId" component={SubjectsPage} />
        <Route
          path="/tecnicaturas/:careerId/asignaturas"
          component={SubjectsPage}
        />
        <Route
          path="/tecnicaturas/:careerId/asignaturas/:subjectId"
          component={SubjectDetailPage}
        />

        {/* Administración - SOLO PARA ADMIN */}
        <Route path="/administradores">
          <AdminRoute>
            <PersonalPage />
          </AdminRoute>
        </Route>

        <Route path="/:rest*">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-gray-600">Página no encontrada</p>
            </div>
          </div>
        </Route>
      </Switch>
    </AppLayout>
  );
}
