import { useState } from "react";
import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  GraduationCap,
  ClipboardList,
  BarChart3,
  Settings,
} from "lucide-react";
import { useStudentEvaluationsStore } from "./store/use-student-evaluations-store";

export default function StudentEvaluations() {
  const { isLoading } = useStudentEvaluationsStore();
  const [activeTab, setActiveTab] = useState<
    "evaluations" | "progress" | "reports" | "settings"
  >("evaluations");

  const tabs = [
    { id: "evaluations", label: "Mis Evaluaciones", icon: ClipboardList },
    { id: "progress", label: "Progreso", icon: BarChart3 },
    { id: "reports", label: "Reportes", icon: GraduationCap },
    { id: "settings", label: "Configuración", icon: Settings },
  ] as const;

  return (
    <PageLayout>
      <PageHeader
        title="Evaluaciones del Estudiante"
        description="Gestiona tus evaluaciones y revisa tu progreso académico"
      >
        <Button>
          <ClipboardList className="w-4 h-4 mr-2" />
          Ver Evaluaciones
        </Button>
      </PageHeader>

      <PageContent>
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Content based on active tab */}
        {activeTab === "evaluations" && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">
                  Cargando evaluaciones...
                </p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Mis Evaluaciones</CardTitle>
                  <CardDescription>
                    Revisa y completa tus evaluaciones pendientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Funcionalidad en desarrollo
                    </h3>
                    <p className="text-muted-foreground">
                      Las evaluaciones del estudiante estarán disponibles
                      próximamente
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "progress" && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Mi Progreso</h3>
            <p className="text-muted-foreground">
              Funcionalidad de progreso en evaluaciones en desarrollo
            </p>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Reportes de Evaluación
            </h3>
            <p className="text-muted-foreground">
              Funcionalidad de reportes en desarrollo
            </p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Configuración</h3>
            <p className="text-muted-foreground">
              Funcionalidad de configuración en desarrollo
            </p>
          </div>
        )}
      </PageContent>
    </PageLayout>
  );
}
