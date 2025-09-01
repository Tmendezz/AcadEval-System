import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  User,
  Mail,
  Star,
  Search,
  Filter,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  StudentForEvaluation,
  CompetencyLevel,
} from "../../types/professor-evaluation";
import { useGetStudentsForAssignment } from "../../hooks";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { StudentEvaluationForm } from "./student-evaluation-form";

interface StudentsEvaluationListProps {
  assignmentId: string;
  assignmentName: string;
  onBack: () => void;
}

export function StudentsEvaluationList({
  assignmentId,
  assignmentName,
  onBack,
}: StudentsEvaluationListProps) {
  const [selectedStudent, setSelectedStudent] =
    useState<StudentForEvaluation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const {
    data: students,
    isLoading,
    refetch,
  } = useGetStudentsForAssignment(assignmentId);

  const filteredStudents =
    students?.filter((student) => {
      const matchesSearch =
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || student.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  const pendingStudents = filteredStudents.filter(
    (s) => s.status === "Pending"
  );
  const evaluatedStudents = filteredStudents.filter(
    (s) => s.status === "Evaluated"
  );

  const getCompetencyLevelColor = (level: CompetencyLevel) => {
    const colors = {
      Ninguno: "bg-gray-500/20 text-gray-600 border-gray-500/30",
      Inicial: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      Intermedio: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
      Avanzado: "bg-orange-500/20 text-orange-600 border-orange-500/30",
      Excelente: "bg-green-500/20 text-green-600 border-green-500/30",
    };
    return colors[level] || colors["Ninguno"];
  };

  const handleEvaluationComplete = () => {
    refetch();
    setSelectedStudent(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <Card className="border-0">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium text-foreground mb-1">
            No hay estudiantes asignados
          </h3>
          <p className="text-sm text-muted-foreground">
            No hay estudiantes asignados a esta competencia.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (selectedStudent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSelectedStudent(null)}
            className="gap-2"
          >
            ← Volver a la lista
          </Button>
          <h3 className="text-lg font-semibold">
            Evaluando: {selectedStudent.studentName}
          </h3>
        </div>

        <StudentEvaluationForm
          student={selectedStudent}
          assignmentId={assignmentId}
          onEvaluationComplete={handleEvaluationComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          ← Volver a asignaciones
        </Button>
        <h2 className="text-xl font-semibold text-foreground">
          {assignmentName}
        </h2>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 bg-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Estudiantes
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {students.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-foreground">
                  {pendingStudents.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Evaluados</p>
                <p className="text-2xl font-bold text-foreground">
                  {evaluatedStudents.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-0 bg-muted/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Pending">Pendientes</SelectItem>
                <SelectItem value="Evaluated">Evaluados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de estudiantes */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <Card
            key={student.studentId}
            className="border-0 bg-gradient-to-r from-card to-card/80 hover:from-card/90 hover:to-card/70 hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedStudent(student)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                      {student.studentName}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{student.studentEmail}</span>
                      </div>
                      {student.assessmentDate && (
                        <span className="text-xs">
                          Evaluado:{" "}
                          {new Date(
                            student.assessmentDate
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      student.status === "Evaluated" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {student.status === "Evaluated"
                      ? "✓ Evaluado"
                      : "⏳ Pendiente"}
                  </Badge>

                  {student.competencyLevel ? (
                    <Badge
                      variant="outline"
                      className={`text-xs ${getCompetencyLevelColor(
                        student.competencyLevel
                      )}`}
                    >
                      <Star className="w-3 h-3 mr-1" />
                      {student.competencyLevel}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-800 border-gray-200 text-xs"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Sin calificar
                    </Badge>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    {student.status === "Evaluated" ? "Editar" : "Evaluar"}
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
