import {
  BarChart3,
  Brain,
  ClipboardEditIcon,
  Copy,
  GraduationCap,
  LayoutDashboard,
  Users,
  Award,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { technicalCareerService } from "@/features/careers/services/technical-career-service";
import { NavGroup } from "@/shared/types/ui";
import { useAuthStore } from "@/shared/stores";
import { UserRole } from "@/features/auth/models";


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
    return user?.roles.some((role: UserRole) => roles.includes(role)) || false;
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

  // Encuestas - Configuración base para todos los roles
  sidebarConfig.surveys = {
    title: "Encuestas Académicas",
    items: [],
  };

  // Admin y coordinadores ven todas las encuestas + plantillas
  if (hasAnyRole([UserRole.Admin, UserRole.Coordinator])) {
    sidebarConfig.surveys.items.push(
      {
        href: "/encuestas",
        icon: BarChart3,
        label: "Encuestas",
      },
      {
        href: "/plantillas",
        icon: Copy,
        label: "Plantillas",
      }
    );
  }
  // Profesores ven sus encuestas específicas
  else if (hasRole(UserRole.Professor)) {
    sidebarConfig.surveys.items.push({
      href: "/encuestas/docente",
      icon: BarChart3,
      label: "Mis Encuestas",
    });
  }
  // Estudiantes ven sus encuestas específicas
  else if (hasRole(UserRole.Student)) {
    sidebarConfig.surveys.items.push({
      href: "/encuestas/alumno",
      icon: BarChart3,
      label: "Mis Encuestas",
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
          href: "/competencias",
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
          href: "/profesor/evaluaciones",
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
          href: "/estudiante/evaluaciones",
          icon: Award,
          label: "Mis Evaluaciones",
        },
      ],
    };

  }

  // Carreras Técnicas - Solo admin y coordinadores
  if (hasAnyRole([UserRole.Admin, UserRole.Coordinator])) {
    sidebarConfig.technicalCareers = {
      title: "Carreras Técnicas",
      items: [
        ...careers.map((career) => ({
          href: `/carreras/${career.id}`,
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
          href: "/admin",
          icon: Users,
          label: "Gestión Académica",
        },
      ],
    };
  }

  return sidebarConfig;
}
