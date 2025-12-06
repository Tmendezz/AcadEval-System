import { useMemo } from "react";
import { Link } from "wouter";
import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import {
  Users,
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  UserCog,
  ArrowRight,
  BarChart3,
  Target,
} from "lucide-react";
import { useGetDashboardStats } from "../hooks/use-get-dashboard-stats";
import { useAuthStore } from "@/features/auth/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

// Componente de tarjeta de estadísticas mejorado
function StatCard({
  title,
  value,
  icon: Icon,
  description,
  color,
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
  color: string;
  isLoading?: boolean;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-3xl font-bold">{value.toLocaleString()}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Componente de acceso rápido
function QuickAccessCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();
  const user = useAuthStore((state) => state.user);

  // Obtener saludo según hora del día (se calcula en cada render para reflejar la hora actual)
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  // Accesos rápidos configurables
  const quickAccessItems = useMemo(
    () => [
      {
        title: "Gestión de Personal",
        description: "Administrar profesores, estudiantes y administradores",
        href: "/personal",
        icon: UserCog,
      },
      {
        title: "Carreras Técnicas",
        description: "Ver y gestionar las carreras del sistema",
        href: "/carreras",
        icon: GraduationCap,
      },
      {
        title: "Evaluaciones",
        description: "Crear y gestionar evaluaciones de competencias",
        href: "/evaluaciones",
        icon: ClipboardCheck,
      },
      {
        title: "Competencias",
        description: "Definir competencias técnicas y blandas",
        href: "/evaluations/competencies",
        icon: Target,
      },
    ],
    []
  );

  return (
    <PageLayout>
      <PageHeader
        title="Panel de Administración"
        description="Sistema de Evaluación de Competencias Académicas"
      />

      <PageContent className="space-y-8">
        {/* Bienvenida */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {greeting}, {user?.name || "Administrador"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  Aquí tienes un resumen del estado actual del sistema
                </p>
              </div>
              <BarChart3 className="h-12 w-12 text-primary/30" />
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Resumen del Sistema</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Estudiantes"
              value={stats?.studentsCount ?? 0}
              icon={Users}
              description="Estudiantes registrados"
              color="bg-blue-500"
              isLoading={isLoading}
            />
            <StatCard
              title="Profesores"
              value={stats?.professorsCount ?? 0}
              icon={BookOpen}
              description="Docentes activos"
              color="bg-emerald-500"
              isLoading={isLoading}
            />
            <StatCard
              title="Carreras"
              value={stats?.careersCount ?? 0}
              icon={GraduationCap}
              description="Carreras técnicas"
              color="bg-violet-500"
              isLoading={isLoading}
            />
            <StatCard
              title="Evaluaciones"
              value={stats?.evaluationsInProgressCount ?? 0}
              icon={ClipboardCheck}
              description="En progreso"
              color="bg-amber-500"
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Accesos Rápidos</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {quickAccessItems.map((item) => (
              <QuickAccessCard key={item.href} {...item} />
            ))}
          </div>
        </div>

        {/* Información del sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acerca del Sistema</CardTitle>
            <CardDescription>
              Sistema de Evaluación de Competencias Académicas - EVAC-ITEC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Esta plataforma permite gestionar evaluaciones de competencias para
              estudiantes de carreras técnicas. Los profesores pueden evaluar el
              progreso de los estudiantes en diferentes competencias técnicas y
              blandas, generando reportes detallados de desempeño.
            </p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/evaluaciones">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Nueva Evaluación
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/personal">
                  <Users className="h-4 w-4 mr-2" />
                  Gestionar Personal
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </PageLayout>
  );
}
