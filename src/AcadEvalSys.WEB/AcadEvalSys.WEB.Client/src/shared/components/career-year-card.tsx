import { Users, CheckCircle, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { CompetencyAssignmentDto } from "@/shared/types/evaluation";
import { Link } from "wouter";

interface CareerYearCardProps {
  year: string;
  assignments: CompetencyAssignmentDto[];
  careerName: string;
  evaluationId: string;
  showDetailsButton?: boolean;
}

export function CareerYearCard({ 
  year, 
  assignments, 
  careerName, 
  evaluationId,
  showDetailsButton = true 
}: CareerYearCardProps) {
  const completed = assignments.filter(a => a.status === "Completed");
  const pending = assignments.filter(a => a.status === "Pending");

  // Crear URL amigable: reemplazar espacios y caracteres especiales
  const careerSlug = careerName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[áéíóúñ]/g, (match) => {
      const accents: { [key: string]: string } = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n'
      };
      return accents[match] || match;
    })
    .replace(/[^a-z0-9-]/g, '');

  // Mapear años en inglés a español para la URL
  const yearMapping: { [key: string]: string } = {
    'First': 'primero',
    'Second': 'segundo', 
    'Third': 'tercero'
  };

  const yearSlug = yearMapping[year] || year.toLowerCase();
  const detailUrl = `/evaluaciones/${evaluationId}/carrera/${careerSlug}/año/${yearSlug}`;

  return (
    <Link href={detailUrl}>
      <div className="border rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-lg hover:border-primary/30 hover:bg-muted/30 bg-card/50 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Año {year}</h3>
              <p className="text-xs text-muted-foreground">{careerName}</p>
            </div>
          </div>
          {showDetailsButton && (
            <div className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <span className="text-sm font-medium">Ver Detalles</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>
        
        {/* Progress Summary */}
        <div className="mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Progreso</span>
            <span className="text-sm font-semibold text-foreground">
              {completed.length}/{assignments.length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-green-600 font-medium">
                {completed.length} completado{completed.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-yellow-600 font-medium">
                {pending.length} pendiente{pending.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        
        {/* Assignments List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Asignaciones</h4>
          {assignments.slice(0, 3).map((assignment) => (
            <div
              key={assignment.assignmentId}
              className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/50"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground truncate">
                  {assignment.professorName}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {assignment.competencyName} • {assignment.subjectName}
                </div>
              </div>
              <Badge
                variant={assignment.status === "Completed" ? "default" : "secondary"}
                className={`
                  ml-2 text-xs px-2 py-1
                  ${assignment.status === "Completed"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-yellow-100 text-yellow-700 border-yellow-200"
                  }
                `}
              >
                {assignment.status === "Completed" ? "Completado" : "Pendiente"}
              </Badge>
            </div>
          ))}
          
          {/* Show more indicator */}
          {assignments.length > 3 && (
            <div className="text-center pt-2">
              <span className="text-xs text-muted-foreground">
                +{assignments.length - 3} más asignaciones
              </span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {assignments.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total de profesores</span>
              <span className="font-medium text-foreground">{assignments.length}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
} 