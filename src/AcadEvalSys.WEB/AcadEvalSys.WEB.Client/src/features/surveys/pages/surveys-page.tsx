import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";

export default function SurveysPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Encuestas"
        description="Gestión de encuestas académicas"
      />

      <PageContent>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Funcionalidad en desarrollo
          </h2>
          <p className="text-muted-foreground mt-2">
            El módulo de encuestas estará disponible próximamente
          </p>
        </div>
      </PageContent>
    </PageLayout>
  );
}
