import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { Users, GraduationCap, ClipboardCheck } from "lucide-react";
import { useGetDashboardStats } from "../hooks/use-get-dashboard-stats";
import { StatsCard, DashboardGrid } from "../components";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  return (
    <PageLayout>
      <PageHeader
        title="Panel Principal"
        description="Bienvenido al sistema de evaluación académica."
      />
      <PageContent>
        <DashboardGrid>
          <StatsCard
            title="Estudiantes Totales"
            value={stats?.studentsCount || 0}
            icon={Users}
            isLoading={isLoading}
          />
          <StatsCard
            title="Docentes Totales"
            value={stats?.professorsCount || 0}
            icon={Users}
            isLoading={isLoading}
          />
          <StatsCard
            title="Carreras Técnicas"
            value={stats?.careersCount || 0}
            icon={GraduationCap}
            isLoading={isLoading}
          />
          <StatsCard
            title="Evaluaciones en Progreso"
            value={stats?.evaluationsInProgressCount || 0}
            icon={ClipboardCheck}
            isLoading={isLoading}
          />
        </DashboardGrid>
      </PageContent>
    </PageLayout>
  );
}
