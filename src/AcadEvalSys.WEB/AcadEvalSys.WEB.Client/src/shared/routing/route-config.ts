import React from "react";
import { UserRole } from "@infrastructure/api/types/auth";

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>;
  requiredRoles?: UserRole[];
  isAdminOnly?: boolean;
  title?: string;
  description?: string;
}

export const routes: RouteConfig[] = [
  // Dashboard
  {
    path: "/",
    component: React.lazy(() => import("@/features/dashboard/dashboard")),
    title: "Dashboard",
  },

  // Surveys - Admin/Coordinator
  {
    path: "/encuestas",
    component: React.lazy(
      () => import("@/features/surveys/pages/surveys-page")
    ),
    title: "Encuestas",
  },
  {
    path: "/encuestas/crear",
    component: React.lazy(
      () => import("@/features/surveys/pages/create-survey-page")
    ),
    title: "Crear Encuesta",
  },
  {
    path: "/encuestas/editar/:id",
    component: React.lazy(
      () => import("@/features/surveys/pages/edit-survey-page")
    ),
    title: "Editar Encuesta",
  },
  {
    path: "/encuestas/progreso/:surveyId",
    component: React.lazy(
      () => import("@/features/surveys/pages/survey-progress-page")
    ),
    title: "Progreso de Encuesta",
  },
  {
    path: "/encuestas/progreso/:surveyId/audiencia/:career/:year",
    component: React.lazy(
      () => import("@/features/surveys/pages/survey-audience-detail-page")
    ),
    title: "Detalle de Audiencia",
  },
  {
    path: "/encuestas/resultados/:surveyId",
    component: React.lazy(
      () => import("@/features/surveys/pages/survey-results-page")
    ),
    title: "Resultados de Encuesta",
  },
  {
    path: "/encuestas/plantillas",
    component: React.lazy(
      () => import("@/features/surveys/pages/templates-page")
    ),
    title: "Plantillas de Encuestas",
  },
  {
    path: "encuestas/plantillas/crear",
    component: React.lazy(
      () => import("@/features/surveys/pages/create-template-page")
    ),
    title: "Crear Plantilla",
  },
  {
    path: "encuestas/plantillas/:id/editar",
    component: React.lazy(
      () => import("@/features/surveys/pages/edit-template-page")
    ),
    title: "Editar Plantilla",
  },

  // Student surveys
  {
    path: "/encuestas/alumno",
    component: React.lazy(
      () => import("@/features/surveys/pages/my-surveys-page")
    ),
    requiredRoles: [UserRole.Student],
    title: "Mis Encuestas",
  },
  {
    path: "/encuestas/alumno/responder/:surveySubjectId",
    component: React.lazy(
      () => import("@/features/surveys/pages/respond-survey-page")
    ),
    requiredRoles: [UserRole.Student],
    title: "Responder Encuesta",
  },
  {
    path: "/encuestas/alumno/ver-respuesta/:surveySubjectId",
    component: React.lazy(
      () => import("@/features/surveys/pages/view-response-page")
    ),
    requiredRoles: [UserRole.Student],
    title: "Ver Respuesta",
  },
  
  // Teacher surveys
  {
    path: "/encuestas/docente",
    component: React.lazy(
      () => import("@/features/surveys/pages/my-surveys-page")
    ),
    requiredRoles: [UserRole.Professor],
    title: "Mis Encuestas",
  },
  {
    path: "/encuestas/docente/responder/:surveySubjectId",
    component: React.lazy(
      () => import("@/features/surveys/pages/respond-survey-page")
    ),
    requiredRoles: [UserRole.Professor],
    title: "Responder Encuesta",
  },
  {
    path: "/encuestas/docente/ver-respuesta/:surveySubjectId",
    component: React.lazy(
      () => import("@/features/surveys/pages/view-response-page")
    ),
    requiredRoles: [UserRole.Professor],
    title: "Ver Respuesta",
  },

  // Evaluations
  {
    path: "/evaluaciones",
    component: React.lazy(() => import("@/features/evaluations/evaluations")),
    title: "Evaluaciones",
  },
  {
    path: "/evaluaciones/dashboard",
    component: React.lazy(
      () => import("@/features/evaluations/pages/evaluations-dashboard")
    ),
    title: "Dashboard de Evaluaciones",
  },
  {
    path: "/evaluaciones/nueva",
    component: React.lazy(
      () => import("@/features/evaluations/pages/create-evaluation-page")
    ),
    title: "Nueva Evaluación",
  },
  {
    path: "/evaluaciones/:id",
    component: React.lazy(
      () => import("@/features/evaluations/pages/evaluation-detail-page")
    ),
    title: "Detalle de Evaluación",
  },
  {
    path: "/evaluaciones/pendientes/:id",
    component: React.lazy(
      () =>
        import(
          "@/features/evaluations/pages/evaluation-to-complete-detail-page"
        )
    ),
    title: "Evaluación Pendiente",
  },
  {
    path: "/evaluaciones/asignaciones/:id",
    component: React.lazy(
      () => import("@/features/evaluations/pages/assignment-detail-page")
    ),
    title: "Detalle de Asignación",
  },
  {
    path: "/evaluaciones/competencias/:id",
    component: React.lazy(
      () => import("@/features/competency-detail/pages/competency-detail-page")
    ),
    title: "Detalle de Competencia",
  },
  {
    path: "/evaluaciones/:evaluationId/carrera/:careerId/año/:year",
    component: React.lazy(
      () => import("@/features/evaluations/pages/career-year-detail-page")
    ),
    title: "Evaluación por Año",
  },
  {
    path: "/evaluaciones/evaluar-estudiantes",
    component: React.lazy(
      () => import("@/features/evaluations/pages/evaluate-students-page")
    ),
    title: "Evaluar Estudiantes",
  },

  // Professor Routes - Patrón: /profesor/...
  {
    path: "/profesor/evaluaciones",
    component: React.lazy(
      () =>
        import(
          "@/features/professor-evaluations/pages/professor-all-evaluations-page"
        )
    ),
    requiredRoles: [UserRole.Professor],
    title: "Mis Evaluaciones",
  },
  {
    path: "/profesor/evaluaciones/evaluar",
    component: React.lazy(() =>
      import(
        "@/features/professor-evaluations/pages/professor-evaluation-page"
      ).then((module) => ({
        default: module.ProfessorEvaluationPage,
      }))
    ),
    requiredRoles: [UserRole.Professor],
    title: "Evaluar Estudiantes",
  },

  // Competencies
  {
    path: "/competencias",
    component: React.lazy(() => import("@/features/competencies/competencies")),
    title: "Competencias",
  },
  {
    path: "/competencias/:id",
    component: React.lazy(
      () => import("@/features/competency-detail/competency-detail")
    ),
    title: "Detalle de Competencia",
  },

  // Student Routes - Patrón: /estudiante/...
  {
    path: "/estudiante/evaluaciones",
    component: React.lazy(
      () =>
        import("@/features/student-evaluations/pages/student-evaluations-page")
    ),
    requiredRoles: [UserRole.Student],
    title: "Mis Evaluaciones",
  },
  {
    path: "/estudiante/evaluaciones/recibidas",
    component: React.lazy(
      () =>
        import("@/features/evaluations/pages/student-received-evaluations-page")
    ),
    requiredRoles: [UserRole.Student],
    title: "Evaluaciones Recibidas",
  },

  // Career Routes - Patrón: /carreras/...
  {
    path: "/carreras/nueva",
    component: React.lazy(() =>
      import("@/features/careers/components/CreateCareerForm").then(
        (module) => ({
          default: module.CreateCareerForm,
        })
      )
    ),
    title: "Nueva Carrera",
  },
  {
    path: "/carreras/:careerId/editar",
    component: React.lazy(() =>
      import("@/features/careers/components/EditCareerForm").then((module) => ({
        default: module.EditCareerForm,
      }))
    ),
    title: "Editar Carrera",
  },
  {
    path: "/carreras/:careerId/asignaturas/:subjectId",
    component: React.lazy(() =>
      import("@/features/careers/components/SubjectDetail").then((module) => ({
        default: module.SubjectDetail,
      }))
    ),
    title: "Detalle de Asignatura",
  },
  {
    path: "/carreras/:careerId",
    component: React.lazy(() =>
      import("@/features/careers/components/CareerDetail").then((module) => ({
        default: module.CareerDetail,
      }))
    ),
    title: "Detalle de Carrera",
  },

  // Admin Routes - Patrón: /admin/...
  {
    path: "/admin",
    component: React.lazy(
      () => import("@/features/administration/administration")
    ),
    isAdminOnly: true,
    title: "Administración",
  },

  // Auth Routes - Patrón: /auth/...
  {
    path: "/auth/login",
    component: React.lazy(() =>
      import("@/features/auth/pages/login-page").then((module) => ({
        default: module.LoginPage,
      }))
    ),
    title: "Iniciar Sesión",
  },
  {
    path: "/auth/forgot-password",
    component: React.lazy(() =>
      import("@/features/auth/pages/forgot-password-page").then((module) => ({
        default: module.ForgotPasswordPage,
      }))
    ),
    title: "Recuperar Contraseña",
  },
];

export const getRouteByPath = (path: string) => {
  return routes.find((route) => route.path === path);
};

export const getRoutesByRole = (userRole: UserRole) => {
  return routes.filter((route) => {
    if (route.isAdminOnly) return userRole === UserRole.Admin;
    if (route.requiredRoles) return route.requiredRoles.includes(userRole);
    return true;
  });
};
