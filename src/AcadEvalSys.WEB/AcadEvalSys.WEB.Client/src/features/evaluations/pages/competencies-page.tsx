import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { navigate } from "wouter/use-browser-location";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Target, Search, Plus } from "lucide-react";
import { Competency } from "@/shared/types/competency";
import { getCompetencies } from "@/shared/services/competency-service";
import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { DataSection } from "@/shared/components/ui/data-section";
import { competencyColumns } from "../columns/competency-columns";

export default function CompetenciesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Queries
  const { data: competencies = [], isLoading } = useQuery({
    queryKey: ["competencies"],
    queryFn: getCompetencies,
  });

  // Filtros
  const filteredCompetencies = competencies.filter((competency: Competency) => {
    const matchesSearch = competency.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || competency.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleRowClick = (competencyId: string) => {
    navigate(`/evaluations/competencies/${competencyId}`);
  };

  const handleNewCompetency = () => {
    navigate("/evaluations/competencies/create");
  };

  return (
    <PageLayout>
      <PageHeader
        title="Competencias"
        description="Gestión de competencias para evaluaciones"
      >
        <Button onClick={handleNewCompetency}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Competencia
        </Button>
      </PageHeader>

      <PageContent>
        <PageSection>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative w-full md:w-auto flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar competencia..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Soft">Competencias Blandas</SelectItem>
                <SelectItem value="Technical">Competencias Técnicas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PageSection>

        {/* Tabla de competencias */}
        <DataSection
          title="Lista de Competencias"
          description="Gestión de competencias para evaluaciones"
          data={filteredCompetencies}
          columns={competencyColumns}
          isLoading={isLoading}
          emptyMessage="No se encontraron competencias"
          emptyIcon={<Target className="w-8 h-8" />}
          onRowClick={handleRowClick}
          className="mb-6"
        />
      </PageContent>
    </PageLayout>
  );
}
