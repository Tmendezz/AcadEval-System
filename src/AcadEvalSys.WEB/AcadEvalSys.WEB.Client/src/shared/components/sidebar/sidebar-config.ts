import {
  BarChart3,
  Brain,
  ClipboardEditIcon,
  Copy, 
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { technicalCareerService } from "@/features/careers/services/technical-career-service";
import { NavGroup } from "@/shared/types/ui";

export function useSidebarConfig() {
  const { data: careers = [] } = useQuery({
    queryKey: ["technical-careers"],
    queryFn: () => technicalCareerService.getAll(),
  });

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
    surveys: {
      title: "Encuestas Académicas",
      items: [
        {
          href: "/surveys",
          icon: BarChart3,
          label: "Encuestas",
        },
        {
          href: "/surveys/templates",
          icon: Copy,
          label: "Plantillas",
        },
      ],
    },
    evaluations: {
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
    },
    technicalCareers: {
      title: "Tecnicaturas",
      items: [
        ...careers.map((career) => ({
          href: `/tecnicaturas/${career.id}/asignaturas`,
          icon: GraduationCap,
          label: career.name,
        })),
      ],
    },
    administration: {
      title: "Administración",
      items: [
        {
          href: "/administradores",
          icon: Users,
          label: "Gestión Académica",
        },
      ],
    },
  };

  return sidebarConfig;
}
