import {
  BarChart3,
  Brain,
  ClipboardEditIcon,
  Copy,
  GraduationCap,
  LayoutDashboard,
  Users,
  Target,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { technicalCareerService } from "@/features/careers/services/technical-career-service";
import { NavGroup } from "@/shared/types/ui";
import { useAuthStore } from "@/features/auth/store";
import { UserRole } from "@/shared/types/auth";

export function useSidebarConfig() {
  const { user } = useAuthStore();
  const { data: careers = [] } = useQuery({
    queryKey: ["technical-careers"],
    queryFn: () => technicalCareerService.getAll(),
    enabled:
      !!user &&
      (user.roles.includes(UserRole.Admin) ||
        user.roles.includes(UserRole.Coordinator)),
  });

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role: UserRole): boolean => {
    return user?.roles.includes(role) || false;
  };

  // Función para verificar si el usuario tiene alguno de los roles especificados
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user?.roles.some((role) => roles.includes(role)) || false;
  };

  const sidebarConfig: Record<string, NavGroup> = {
    main: {
      title: "Inicio",
      items: [
        {
          href: "/",
          icon: LayoutDashboard,
          label: "Panel Principal",
        },
      ],
    },
  };

  // Encuestas - Diferentes vistas según el rol
  sidebarConfig.surveys = {
    title: "Encuestas Académicas",
    items: [
      {
        href: "/surveys",
        icon: BarChart3,
        label: "Mis Encuestas",
      },
    ],
  };

  // Solo admin y coordinadores ven plantillas
  if (hasAnyRole([UserRole.Admin, UserRole.Coordinator])) {
    sidebarConfig.surveys.items.push({
      href: "/surveys/templates",
      icon: Copy,
      label: "Plantillas",
    });
  }

  // Evaluaciones - Solo para administradores
  if (hasRole(UserRole.Admin)) {
    sidebarConfig.evaluations = {
      title: "Evaluaciones por Competencias",
      items: [
        {
          href: "/evaluaciones",
          icon: ClipboardEditIcon,
          label: "Evaluaciones",
        },
        {
          href: "/evaluaciones/competencias",
          icon: Brain,
          label: "Competencias",
        },
      ],
    };
  }

  // Evaluaciones para docentes
  if (hasRole(UserRole.Professor)) {
    sidebarConfig.professorEvaluations = {
      title: "Evaluaciones por Competencias",
      items: [
        {
          href: "/evaluaciones/docentes/mis-evaluaciones",
          icon: ClipboardEditIcon,
          label: "Mis Evaluaciones",
        },
      ],
    };
  }

  // Dashboard del estudiante - Solo para estudiantes
  if (hasRole(UserRole.Student)) {
    sidebarConfig.studentDashboard = {
      title: "Evaluaciones por Competencias",
      items: [
        {
          href: "/evaluaciones/alumnos/mis-evaluaciones",
          icon: Award,
          label: "Mis Evaluaciones",
        },
      ],
    };
  }

  // Tecnicaturas - Solo admin y coordinadores
  if (hasAnyRole([UserRole.Admin, UserRole.Coordinator])) {
    sidebarConfig.technicalCareers = {
      title: "Tecnicaturas",
      items: [
        ...careers.map((career) => ({
          href: `/tecnicaturas/${career.id}/asignaturas`,
          icon: GraduationCap,
          label: career.name,
        })),
      ],
    };
  }

  // Administración - Solo admin
  if (hasRole(UserRole.Admin)) {
    sidebarConfig.administration = {
      title: "Administración",
      items: [
        {
          href: "/administradores",
          icon: Users,
          label: "Gestión Académica",
        },
      ],
    };
  }

  return sidebarConfig;
}
