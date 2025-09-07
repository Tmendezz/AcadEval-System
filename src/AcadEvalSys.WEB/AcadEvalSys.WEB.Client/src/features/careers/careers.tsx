import { useParams } from "wouter";
import { useGetTechnicalCareerById } from "./hooks/use-technical-careers";
import { CareerDetail } from "./components/CareerDetail";
import { LoadingState } from "@/shared/components/ui/loading-state";
import {
  PageLayout,
  PageContent,
} from "@/shared/components/layout/page-layout";

export default function Careers() {
  const { careerId } = useParams();

  const {
    data: careerData,
    isLoading,
    error,
  } = useGetTechnicalCareerById(careerId!);

  if (isLoading) {
    return (
      <PageLayout>
        <PageContent>
          <LoadingState message="Cargando detalles de la carrera..." />
        </PageContent>
      </PageLayout>
    );
  }

  if (error || !careerData) {
    return (
      <PageLayout>
        <PageContent>
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">
              Carrera no encontrada
            </h3>
            <p className="text-muted-foreground">
              No se pudo cargar la información de la carrera solicitada.
            </p>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  return <CareerDetail />;
}
