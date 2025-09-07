import { Switch, Route, Redirect } from "wouter";
import EvaluationsDashboard from "./pages/evaluations-dashboard";
import EvaluationToCompleteDetailPage from "./pages/evaluation-to-complete-detail-page";
import AssignmentDetailPage from "./pages/assignment-detail-page";
import CreateEvaluationPage from "./pages/create-evaluation-page";
import EvaluationsPage from "./pages/evaluations-page";
import { CompetencyDetailPage } from "@/features/competency-detail";

export default function EvaluationsRouter() {
  return (
    <Switch>
      <Route
        path="/evaluaciones/competencias/:id"
        component={CompetencyDetailPage}
      />
      <Route
        path="/evaluaciones/competencias"
        component={() => <Redirect to="/competencias" />}
      />
      <Route path="/evaluaciones/dashboard" component={EvaluationsDashboard} />
      <Route
        path="/evaluaciones/pendientes/:id"
        component={EvaluationToCompleteDetailPage}
      />
      <Route
        path="/evaluaciones/asignaciones/:id"
        component={AssignmentDetailPage}
      />
      <Route path="/evaluaciones/nueva" component={CreateEvaluationPage} />
      <Route path="/evaluaciones" component={EvaluationsPage} />
    </Switch>
  );
}
