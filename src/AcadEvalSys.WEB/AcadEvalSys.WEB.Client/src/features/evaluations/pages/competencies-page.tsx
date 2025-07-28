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
import { StatCard } from "@/shared/components/ui/stat-card";
import { ContainerPage } from "@/shared/components/container-page";
import { SkeletonWrapper } from "@/shared/components/skeleton-wrapper";
import { Target, Brain, Code, Search, Plus } from "lucide-react";
import { Competency } from "@/shared/types";
import { getCompetencies } from "@/shared/services/competency-service";
import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { DataTable } from "@/shared/components/data-table/data-table";
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

  // Estadísticas
  const competencyStats = [
    {
      key: "totalCompetencies",
      label: "Total Competencias",
      value: competencies.length,
      icon: <Target className="h-4 w-4" />,
    },
    {
      key: "softCompetencies",
      label: "Competencias Blandas",
      value: competencies.filter((c: Competency) => c.type === "Soft").length,
      icon: <Brain className="h-4 w-4" />,
    },
    {
      key: "technicalCompetencies",
      label: "Competencias Técnicas",
      value: competencies.filter((c: Competency) => c.type === "Technical")
        .length,
      icon: <Code className="h-4 w-4" />,
    },
  ];

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
        {/* Estadísticas */}
        <PageSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {competencyStats.map((stat) => (
              <StatCard
                key={stat.key}
                title={stat.label}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
          </div>
        </PageSection>

        {/* Filtros */}
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
        <PageSection>
          <SkeletonWrapper isLoading={isLoading}>
            <DataTable
              columns={competencyColumns}
              data={filteredCompetencies}
              onRowClick={handleRowClick}
            />
          </SkeletonWrapper>
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
