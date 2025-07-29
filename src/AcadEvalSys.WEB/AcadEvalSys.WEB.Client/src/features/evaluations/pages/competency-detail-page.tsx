import { useParams, Link } from "wouter";
import { ChevronLeft, Brain, Target, Edit, Trash2 } from "lucide-react";
import { useCompetencyById } from "@/shared/hooks/use-competencies";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";

export default function CompetencyDetailPage() {
  const { id } = useParams();
  const { data: competency, isLoading, error } = useCompetencyById(id || "");

  if (isLoading) {
    return (
      <PageLayout>
        <div className="space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </PageLayout>
    );
  }

  if (error || !competency) {
    return (
      <PageLayout>
        <Link href="/evaluations/competencies">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Volver a Competencias
          </Button>
        </Link>
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Competencia no encontrada
            </h3>
            <p className="text-sm text-muted-foreground">
              La competencia "{id}" no existe.
            </p>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/evaluations/competencies">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Volver
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border border-border/40 ${
                    competency.type === "Soft"
                      ? "bg-primary/10 text-primary"
                      : "bg-chart-4/10 text-chart-4"
                  }`}
                >
                  {competency.type === "Soft" ? (
                    <Brain className="w-5 h-5" />
                  ) : (
                    <Target className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {competency.name}
                  </h1>
                  <Badge
                    variant="secondary"
                    className={`mt-1 ${
                      competency.type === "Soft"
                        ? "bg-primary/10 text-primary"
                        : "bg-chart-4/10 text-chart-4"
                    }`}
                  >
                    {competency.type === "Soft"
                      ? "Competencias Blandas"
                      : "Competencias Técnicas"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
            </div>
          </div>
        </PageSection>

        <PageSection>
          {/* Descripción */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
              <CardDescription>
                Información detallada sobre esta competencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {competency.description}
              </p>
            </CardContent>
          </Card>
        </PageSection>

        <PageSection>
          <Card>
            <CardHeader>
              <CardTitle>Niveles de Competencia</CardTitle>
              <CardDescription>
                Descripción de los diferentes niveles de dominio de esta
                competencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competency.competencyLevelDescriptions ? (
                  Object.entries(competency.competencyLevelDescriptions).map(
                    ([level, description]) => (
                      <div
                        key={level}
                        className="flex items-start justify-between p-4 border rounded-lg bg-muted/30"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="font-medium">
                              {level}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </Button>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No hay niveles definidos para esta competencia
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
