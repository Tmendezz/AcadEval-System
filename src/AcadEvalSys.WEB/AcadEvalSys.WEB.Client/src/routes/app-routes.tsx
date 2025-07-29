import { Route, Switch } from "wouter";
import { AppLayout } from "../shared/components/layout";
import { DashboardPage } from "../features/dashboard";
import {
  CompetenciesPage,
  EvaluationsPage,
  CompetencyDetailPage,
  CreateEvaluationPage,
} from "../features/evaluations";
import {
  CreateSurveyPage,
  SurveysPage,
  TemplatesPage,
} from "../features/surveys";
import { PersonalPage } from "../features/administration";
import { SubjectDetailPage, SubjectsPage } from "../features/careers";

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

        {/* Carreras */}
        <Route
          path="/tecnicaturas/:careerId/asignaturas"
          component={SubjectsPage}
        />
        <Route path="/tecnicaturas/:careerId" component={SubjectsPage} />
        <Route
          path="/tecnicaturas/:careerId/asignaturas/:subjectId"
          component={SubjectDetailPage}
        />

        {/* Administración */}
        <Route path="/administradores" component={PersonalPage} />
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
