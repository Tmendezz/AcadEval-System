import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";

export default function DashboardPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Panel Principal"
        description="Bienvenido al sistema AcadEval"
      />

      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Encuestas</h3>
            <p className="text-sm text-muted-foreground">
              Gestionar encuestas académicas
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Evaluaciones</h3>
            <p className="text-sm text-muted-foreground">
              Evaluaciones por competencias
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Administración</h3>
            <p className="text-sm text-muted-foreground">
              Gestión de personal y tecnicaturas
            </p>
          </div>
        </div>
      </PageContent>
    </PageLayout>
  );
}
