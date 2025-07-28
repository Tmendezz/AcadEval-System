import {
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
  Settings,
  Users,
} from "lucide-react";
import { NavGroup } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";
import { technicalCareerService } from "@/features/careers/services/technical-career-service";

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
          icon: BarChart3,
          label: "Panel Principal",
        },
      ],
    },
    surveys: {
      title: "Encuestas Académicas",
      items: [
        {
          href: "/surveys",
          icon: FileText,
          label: "Encuestas",
        },
        {
          href: "/surveys/templates",
          icon: BookOpen,
          label: "Plantillas",
        },
      ],
    },
    evaluations: {
      title: "Evaluaciones por Competencias",
      items: [
        {
          href: "/evaluations",
          icon: Settings,
          label: "Evaluaciones",
        },
        {
          href: "/evaluations/competencies",
          icon: GraduationCap,
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
          href: "/administration/personal",
          icon: Users,
          label: "Personal",
        },
      ],
    },
  };

  return sidebarConfig;
}
