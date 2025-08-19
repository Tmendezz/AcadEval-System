import { Route, Switch } from "wouter";
import { AppLayout } from "../shared/components/layout";
import { DashboardPage } from "../features/dashboard";
import {
  CompetenciesPage,
  EvaluationsPage,
  CompetencyDetailPage,
  CreateEvaluationPage,
} from "../features/evaluations";
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
import { AdminRoute } from "../features/auth/components";

export function AppRoutes() {
  return (
    <AppLayout>
      <Switch>
        {/* Encuestas academicas*/}
        <Route path="/" component={DashboardPage} />
        <Route path="/surveys" component={SurveysPage} />
        <Route path="/surveys/templates" component={TemplatesPage} />
        <Route path="/surveys/new" component={CreateSurveyPage} />

        {/* Evaluaciones */}
        <Route path="/evaluaciones/competencias" component={CompetenciesPage} />
        <Route path="/evaluaciones" component={EvaluationsPage} />
        <Route path="/evaluaciones/nueva" component={CreateEvaluationPage} />
        <Route
          path="/evaluaciones/competencias/:id"
          component={CompetencyDetailPage}
        />
        <Route path="/evaluaciones/:id" component={EvaluationDetailPage} />
        <Route
          path="/evaluaciones/:evaluationId/carrera/:careerSlug/año/:yearSlug"
          component={CareerYearDetailPage}
        />

        {/* Carreras */}
        <Route
          path="/tecnicaturas/:careerId/asignaturas"
          component={SubjectsPage}
        />
        <Route
          path="/tecnicaturas/nueva"
          component={CreateTechnicalCareerPage}
        />
        <Route
          path="/tecnicaturas/:careerId/editar"
          component={EditTechnicalCareerPage}
        />
        <Route path="/tecnicaturas/:careerId" component={SubjectsPage} />
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
