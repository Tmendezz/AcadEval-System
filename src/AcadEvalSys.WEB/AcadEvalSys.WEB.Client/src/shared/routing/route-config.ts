import { UserRole } from "@/features/auth/models";
import React from "react";

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  requiredRoles?: UserRole[];
  isAdminOnly?: boolean;
  title?: string;
  description?: string;
}

export const routes: RouteConfig[] = [
  // Dashboard  
  {
    path: "/",
    component: React.lazy(() => import("@/features/dashboard/pages/dashboard")),
    title: "Dashboard",
  },

  // Surveys - Admin/Coordinator
  {
    path: "/encuestas",
    component: React.lazy(
      () => import("@/features/surveys/pages/surveys-page")
    ),
    requiredRoles: [UserRole.Admin, UserRole.Coordinator],
    title: "Encuestas",
  },
  {
    path: "/encuestas/crear",
    component: React.lazy(
      () => import("@/features/surveys/pages/create-survey-page")
    ),
    requiredRoles: [UserRole.Admin],
    title: "Crear Encuesta",
  },
  {
    path: "/encuestas/editar/:id",
    component: React.lazy(
      () => import("@/features/surveys/pages/edit-survey-page")
    ),
    requiredRoles: [UserRole.Admin, UserRole.Coordinator],
    title: "Editar Encuesta",
  },
  {
    path: "/encuestas/progreso/:surveyId",
    component: React.lazy(
      () => import("@/features/surveys/pages/survey-progress-page")
    ),
    requiredRoles: [UserRole.Admin, UserRole.Coordinator],
    title: "Progreso de Encuesta",
  },
  {
    path: "/encuestas/progreso/:surveyId/audiencia/:career/:year",
    component: React.lazy(
      () => import("@/features/surveys/pages/survey-audience-detail-page")
    ),
    requiredRoles: [UserRole.Admin, UserRole.Coordinator],
    title: "Detalle de Audiencia",
  },
  {
    path: "/encuestas/resultados/:surveyId",
    component: React.lazy(
      () => import("@/features/surveys/pages/survey-results-page")
    ),
    requiredRoles: [UserRole.Admin, UserRole.Coordinator],
    title: "Resultados de Encuesta",
  },
  {
    path: "/plantillas",
    component: React.lazy(
      () => import("@/features/surveys/pages/templates-page")
    ),
    requiredRoles: [UserRole.Admin, UserRole.Coordinator],
    title: "Plantillas de Encuestas",
  },
  {
    path: "/plantillas/crear",
    component: React.lazy(
      () => import("@/features/surveys/pages/create-template-page")
    ),
    requiredRoles: [UserRole.Admin, UserRole.Coordinator],
    title: "Crear Plantilla",
  },
  {
    path: "/plantillas/:id/editar",
    component: React.lazy(
      () => import("@/features/surveys/pages/edit-template-page")
    ),
    requiredRoles: [UserRole.Admin, UserRole.Coordinator],
    title: "Editar Plantilla",
  },
  {
    path: "/encuestas/alumno",
    component: React.lazy(
      () => import("@/features/surveys/pages/my-surveys-page")
    ),
    requiredRoles: [UserRole.Student],
    title: "Mis Encuestas",
  },
  {
    path: "/encuestas/responder/:surveyId",
    component: React.lazy(
      () => import("@/features/surveys/pages/respond-survey-page")
    ),
    requiredRoles: [UserRole.Student, UserRole.Professor],
    title: "Responder Encuesta",
  },
  {
    path: "/encuestas/ver-respuesta/:surveyId",
    component: React.lazy(
      () => import("@/features/surveys/pages/view-response-page")
    ),
    requiredRoles: [UserRole.Student, UserRole.Professor],
    title: "Ver Respuesta",
  },  
  {
    path: "/encuestas/docente",
    component: React.lazy(
      () => import("@/features/surveys/pages/my-surveys-page")
    ),
    requiredRoles: [UserRole.Professor],
    title: "Mis Encuestas",
  },
  

  {
    path: "/evaluaciones",
    component: React.lazy(
      () => import("@/features/evaluations/pages/evaluations-page")
    ),
    requiredRoles: [UserRole.Admin],
    title: "Evaluaciones",
  },
  {
    path: "/evaluaciones/dashboard",
    component: React.lazy(
      () => import("@/features/evaluations/pages/evaluations-dashboard")
    ),
    requiredRoles: [UserRole.Admin],
    title: "Dashboard de Evaluaciones",
  },
  {
    path: "/evaluaciones/nueva",
    component: React.lazy(
      () => import("@/features/evaluations/pages/create-evaluation-page")
    ),
    requiredRoles: [UserRole.Admin],
    title: "Nueva Evaluación",
  },
  {
    path: "/evaluaciones/:id",
    component: React.lazy(
      () => import("@/features/evaluations/pages/evaluation-detail-page")
    ),
    requiredRoles: [UserRole.Admin],
    title: "Detalle de Evaluación",
  },
    {
    path: "/evaluaciones/competencias/:id",
    component: React.lazy(
      () => import("@/features/competency-detail/pages/competency-detail-page")
    ),
    requiredRoles: [UserRole.Admin],
    title: "Detalle de Competencia",
  },
  {
    path: "/evaluaciones/:evaluationId/carrera/:careerId/año/:year",
    component: React.lazy(
      () => import("@/features/evaluations/pages/career-year-detail-page")
    ),
    requiredRoles: [UserRole.Admin],
    title: "Evaluación por Año",
  },
  

  // Professor Routes - Patrón: /profesor/...
  {
    path: "/profesor/evaluaciones",
    component: React.lazy(
      () => import("@/features/professor-evaluations/pages/professor-all-evaluations-page.tsx")
    ),
    requiredRoles: [UserRole.Professor],
    title: "Mis Evaluaciones",
  },
    
  {
    path: "/profesor/evaluaciones/:assignmentId",
    component: React.lazy(() =>
      import(
        "@/features/professor-evaluations/pages/professor-evaluation-page.tsx"
      )
    ),
    requiredRoles: [UserRole.Professor],
    title: "Evaluación de Competencia",
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
      () => import("@/features/student-evaluations/pages/student-received-evaluations-page")
    ),
    requiredRoles: [UserRole.Student],
    title: "Mis Evaluaciones",
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
      import("@/features/careers/pages/SubjectDetail").then((module) => ({
        default: module.SubjectDetail,
      }))
    ),
    title: "Detalle de Asignatura",
  },
  {
    path: "/carreras/:careerId",
    component: React.lazy(() =>
      import("@/features/careers/pages/CareerDetail").then((module) => ({
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
