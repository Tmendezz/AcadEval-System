import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { Competency } from "@infrastructure/api/types/competency";
import { CompetencyLevelsForm } from "./competency-levels-form";

interface CompetencyDetailLayoutProps {
  competency: Competency | null | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function CompetencyDetailLayout({
  competency,
  isLoading,
  error,
}: CompetencyDetailLayoutProps) {
  const renderLoading = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-6 w-1/2" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
  );

  const renderError = () => (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        No se pudo cargar la competencia. Por favor, intente de nuevo más tarde.
      </AlertDescription>
    </Alert>
  );

  const renderCompetencyDetails = () => {
    if (!competency) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Competencia no encontrada</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{competency.name}</h2>
              <Badge
                variant={competency.type === "Soft" ? "secondary" : "default"}
              >
                {competency.type === "Soft"
                  ? "Competencias Blandas"
                  : "Competencias Técnicas"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{competency.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Niveles de Competencia</CardTitle>
          </CardHeader>
          <CardContent>
            <CompetencyLevelsForm competency={competency} />
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <PageLayout>
      <PageHeader
        title="Detalle de Competencia"
        description="Ver y editar los detalles de la competencia."
      >
        <Link href="/competencias">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Competencias
          </Button>
        </Link>
      </PageHeader>
      <PageContent>
        {isLoading && renderLoading()}
        {error && renderError()}
        {!isLoading && !error && renderCompetencyDetails()}
      </PageContent>
    </PageLayout>
  );
}
