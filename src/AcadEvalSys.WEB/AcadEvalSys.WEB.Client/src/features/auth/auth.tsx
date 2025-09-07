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
import { LogIn, UserPlus, Shield, Settings } from "lucide-react";
import { useAuthStore } from "./store/use-auth-store";

export default function Auth() {
  const { isLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    "login" | "register" | "profile" | "settings"
  >("login");

  const tabs = [
    { id: "login", label: "Iniciar Sesión", icon: LogIn },
    { id: "register", label: "Registrarse", icon: UserPlus },
    { id: "profile", label: "Perfil", icon: Shield },
    { id: "settings", label: "Configuración", icon: Settings },
  ] as const;

  return (
    <PageLayout>
      <PageHeader
        title="Sistema de Autenticación"
        description="Gestiona el acceso y la seguridad del sistema"
      >
        <Button>
          <Shield className="w-4 h-4 mr-2" />
          Configurar Seguridad
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
        {activeTab === "login" && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">
                  Verificando sesión...
                </p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Iniciar Sesión</CardTitle>
                  <CardDescription>
                    Accede al sistema con tus credenciales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <LogIn className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Funcionalidad en desarrollo
                    </h3>
                    <p className="text-muted-foreground">
                      El módulo de autenticación estará disponible próximamente
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "register" && (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Registro de Usuarios</h3>
            <p className="text-muted-foreground">
              Funcionalidad de registro en desarrollo
            </p>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gestión de Perfil</h3>
            <p className="text-muted-foreground">
              Funcionalidad de perfil en desarrollo
            </p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Configuración de Seguridad
            </h3>
            <p className="text-muted-foreground">
              Funcionalidad de configuración en desarrollo
            </p>
          </div>
        )}
      </PageContent>
    </PageLayout>
  );
}
