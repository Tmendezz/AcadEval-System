import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Target,
  Users,
  BookOpen,
  GraduationCap,
  Search,
  Filter,
} from "lucide-react";
import {
  ProfessorEvaluationAssignment,
  ProfessorEvaluationFilters,
} from "../../types/professor-evaluation";
import { useGetProfessorAssignments } from "../../hooks";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface ProfessorAssignmentsListProps {
  evaluationId: string;
  onAssignmentSelect: (assignment: ProfessorEvaluationAssignment) => void;
}

export function ProfessorAssignmentsList({
  evaluationId,
  onAssignmentSelect,
}: ProfessorAssignmentsListProps) {
  const [filters, setFilters] = useState<ProfessorEvaluationFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  const { data: assignments, isLoading } = useGetProfessorAssignments(
    evaluationId,
    filters
  );

  const filteredAssignments =
    assignments?.filter(
      (assignment) =>
        assignment.competencyName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.subjectName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.careerName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "InProgress":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Completed":
        return "✓ Completado";
      case "InProgress":
        return "⏳ En Progreso";
      default:
        return "⏳ Pendiente";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <Card className="border-0">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium text-foreground mb-1">
            No hay asignaciones disponibles
          </h3>
          <p className="text-sm text-muted-foreground">
            No tienes asignaciones de competencias para evaluar en esta
            evaluación.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card className="border-0 bg-muted/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar competencia, asignatura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value === "all" ? undefined : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Pending">Pendiente</SelectItem>
                <SelectItem value="InProgress">En Progreso</SelectItem>
                <SelectItem value="Completed">Completado</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.careerYear?.toString() || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  careerYear: value === "all" ? undefined : parseInt(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Año de carrera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los años</SelectItem>
                <SelectItem value="1">Primer Año</SelectItem>
                <SelectItem value="2">Segundo Año</SelectItem>
                <SelectItem value="3">Tercer Año</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setFilters({})}
              className="w-full"
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de asignaciones */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <Card
            key={assignment.assignmentId}
            className="border-0 bg-gradient-to-r from-card to-card/80 hover:from-card/90 hover:to-card/70 hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group"
            onClick={() => onAssignmentSelect(assignment)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  {/* Header con competencia y asignatura */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {assignment.competencyName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{assignment.subjectName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          <span>
                            {assignment.careerName} - Año{" "}
                            {assignment.careerYear}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progreso */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">
                        Progreso de evaluación
                      </span>
                      <span className="font-semibold text-foreground">
                        {Math.round(assignment.progressPercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          assignment.progressPercentage === 100
                            ? "bg-green-500"
                            : assignment.progressPercentage > 0
                            ? "bg-yellow-500"
                            : "bg-orange-500"
                        }`}
                        style={{
                          width: `${assignment.progressPercentage}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      {assignment.evaluatedStudents} de{" "}
                      {assignment.totalStudents} estudiantes evaluados
                    </div>
                  </div>
                </div>

                {/* Estado y botón */}
                <div className="flex flex-col items-end gap-3 ml-4">
                  <Badge
                    variant={getStatusVariant(assignment.status)}
                    className={`text-xs px-3 py-1.5 font-medium ${
                      assignment.status === "Completed"
                        ? "bg-green-500/20 text-green-600 border-green-500/30"
                        : assignment.status === "InProgress"
                        ? "bg-blue-500/20 text-blue-600 border-blue-500/30"
                        : "bg-orange-500/20 text-orange-600 border-orange-500/30"
                    }`}
                  >
                    {getStatusLabel(assignment.status)}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Evaluar Estudiantes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
