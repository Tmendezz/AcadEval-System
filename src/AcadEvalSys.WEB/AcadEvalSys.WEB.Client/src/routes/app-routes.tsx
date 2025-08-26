import { Route, Switch } from "wouter";
import { AppLayout } from "../shared/components/layout";
import { DashboardPage } from "../features/dashboard";
import {
  CompetenciesPage,
  EvaluationsPage,
  CompetencyDetailPage,
  CreateEvaluationPage,
  ProfessorEvaluationPage,
} from "../features/evaluations";
import ProfessorPendingEvaluationsPage from "../features/evaluations/pages/professor-pending-evaluations-page";
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
        <Route path="/evaluaciones/pendientes">
          <ProtectedRoute requiredRoles={[UserRole.Professor]}>
            <ProfessorPendingEvaluationsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/evaluaciones/completadas">
          <ProtectedRoute requiredRoles={[UserRole.Professor]}>
            <ProfessorPendingEvaluationsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/evaluaciones/recibidas">
          <ProtectedRoute requiredRoles={[UserRole.Student]}>
            <StudentReceivedEvaluationsPage />
          </ProtectedRoute>
        </Route>

        {/* RUTAS GENÉRICAS VAN AL FINAL */}
        <Route path="/evaluaciones/:id" component={EvaluationDetailPage} />
        <Route
          path="/evaluaciones/:evaluationId/carrera/:careerId/año/:year"
          component={CareerYearDetailPage}
        />
        <Route path="/evaluaciones/:id/evaluar">
          <ProtectedRoute requiredRoles={[UserRole.Professor]}>
            <ProfessorEvaluationPage />
          </ProtectedRoute>
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

        {/* Carreras - Solo para administradores y coordinadores */}
        <Route path="/tecnicaturas/nueva">
          <CreateTechnicalCareerPage />
        </Route>
        <Route path="/tecnicaturas/:careerId/editar">
          <EditTechnicalCareerPage />
        </Route>

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
