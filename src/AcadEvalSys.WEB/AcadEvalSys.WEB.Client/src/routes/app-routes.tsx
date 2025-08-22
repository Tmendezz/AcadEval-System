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
import {
  AdminRoute,
  CoordinatorRoute,
  ProtectedRoute,
} from "../features/auth/components";

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
        <Route path="/evaluaciones/:id" component={EvaluationDetailPage} />
        <Route
          path="/evaluaciones/:evaluationId/carrera/:careerId/año/:year"
          component={CareerYearDetailPage}
        />

        {/* Evaluaciones - Solo para administradores y coordinadores */}
        <Route path="/evaluaciones/nueva">
          <CoordinatorRoute>
            <CreateEvaluationPage />
          </CoordinatorRoute>
        </Route>

        {/* Evaluaciones - Solo para profesores */}
        <Route path="/evaluaciones/:id/evaluar">
          <ProtectedRoute requiredRoles={["Professor"]}>
            <ProfessorEvaluationPage />
          </ProtectedRoute>
        </Route>

        {/* Evaluaciones pendientes para profesores */}
        <Route path="/evaluaciones/pendientes">
          <ProtectedRoute requiredRoles={["Professor"]}>
            <ProfessorPendingEvaluationsPage />
          </ProtectedRoute>
        </Route>

        {/* Evaluaciones completadas para profesores */}
        <Route path="/evaluaciones/completadas">
          <ProtectedRoute requiredRoles={["Professor"]}>
            <ProfessorPendingEvaluationsPage />
          </ProtectedRoute>
        </Route>

        {/* Evaluaciones recibidas para estudiantes */}
        <Route path="/evaluaciones/recibidas">
          <ProtectedRoute requiredRoles={["Student"]}>
            <StudentReceivedEvaluationsPage />
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
          <CoordinatorRoute>
            <CreateTechnicalCareerPage />
          </CoordinatorRoute>
        </Route>
        <Route path="/tecnicaturas/:careerId/editar">
          <CoordinatorRoute>
            <EditTechnicalCareerPage />
          </CoordinatorRoute>
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
