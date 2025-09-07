// Main container component - follows Screaming Architecture
export { default as StudentEvaluations } from "./student-evaluations";

// Components
export { StudentEvaluations as StudentEvaluationsComponent } from "./components/student-evaluations";
export { EvaluationInstancesList } from "./components/evaluation-instance-list";
export { EvaluationsPanel } from "./components/evaluations-panel";

// Hooks
export { useEvaluationInstances } from "./hooks/use-evaluation-instances";
export { useEvaluations } from "./hooks/use-evaluations";
export { useReportDownload } from "./hooks/use-report-download";

// Services
export { studentEvaluationsApi } from "./services";

// Models
export * from "./models";

// Types are now exported directly from models
