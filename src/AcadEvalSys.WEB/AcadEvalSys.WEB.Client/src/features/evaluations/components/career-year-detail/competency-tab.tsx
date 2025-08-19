import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { ProfessorAssignmentCard } from "./professor-assignment-card";

interface CompetencyGroup {
  competencyName: string;
  assignments: Array<{
    assignmentId: string;
    professorName: string;
    subjectName: string;
    status: string;
    evaluatedStudentsCount: number;
    totalStudentsCount: number;
    progressPercentage: number;
  }>;
  totalStudents: number;
  evaluatedStudents: number;
  progressPercentage: number;
}

interface CompetencyTabProps {
  competency: CompetencyGroup;
}

export function CompetencyTab({ competency }: CompetencyTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{competency.competencyName}</span>
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {competency.assignments.length} profesor
                {competency.assignments.length !== 1 ? "es" : ""}
              </Badge>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {Math.round(competency.progressPercentage)}%
                </div>
                <Progress
                  value={competency.progressPercentage}
                  className="w-20 h-2"
                />
                <div className="text-sm text-muted-foreground">
                  {competency.evaluatedStudents}/{competency.totalStudents}
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {competency.assignments.map((assignment) => (
              <ProfessorAssignmentCard
                key={assignment.assignmentId}
                assignment={assignment}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
