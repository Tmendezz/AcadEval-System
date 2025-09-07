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
import { ClipboardList, Users, BarChart3, Settings } from "lucide-react";
import { useProfessorEvaluationsStore } from "./store/use-professor-evaluations-store";

export default function ProfessorEvaluations() {
  const { isLoading } = useProfessorEvaluationsStore();
  const [activeTab, setActiveTab] = useState<
    "assignments" | "evaluate" | "progress" | "settings"
  >("assignments");

  const tabs = [
    { id: "assignments", label: "Mis Asignaciones", icon: ClipboardList },
    { id: "evaluate", label: "Evaluar Estudiantes", icon: Users },
    { id: "progress", label: "Progreso", icon: BarChart3 },
    { id: "settings", label: "Configuración", icon: Settings },
  ] as const;

  return (
    <PageLayout>
      <PageHeader
        title="Evaluaciones del Profesor"
        description="Gestiona tus asignaciones y evalúa a los estudiantes en competencias específicas"
      >
        <Button>
          <Users className="w-4 h-4 mr-2" />
          Evaluar Estudiantes
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
        {activeTab === "assignments" && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">
                  Cargando asignaciones...
                </p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Mis Asignaciones de Evaluación</CardTitle>
                  <CardDescription>
                    Revisa las competencias que tienes asignadas para evaluar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Funcionalidad en desarrollo
                    </h3>
                    <p className="text-muted-foreground">
                      Las asignaciones de evaluación estarán disponibles
                      próximamente
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "evaluate" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evaluar Estudiantes</CardTitle>
                <CardDescription>
                  Selecciona una asignación para comenzar a evaluar estudiantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Funcionalidad en desarrollo
                  </h3>
                  <p className="text-muted-foreground">
                    La evaluación de estudiantes estará disponible próximamente
                  </p>
                </div>
              </CardContent>
            </Card>
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
