import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { CompetencyTab } from "./competency-tab";
import { GraduationCap } from "lucide-react";

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

interface CompetencyTabsProps {
  competencyGroups: CompetencyGroup[];
}

export function CompetencyTabs({ competencyGroups }: CompetencyTabsProps) {
  const [selectedCompetency, setSelectedCompetency] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (competencyGroups.length > 0 && !selectedCompetency) {
      setSelectedCompetency(competencyGroups[0].competencyName);
    }
  }, [competencyGroups, selectedCompetency]);

  if (competencyGroups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Competencias y Alumnos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No hay competencias asignadas para este año de carrera.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Competencias y Alumnos</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={competencyGroups[0]?.competencyName}
          className="w-full"
          onValueChange={setSelectedCompetency}
        >
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {competencyGroups.map((competency) => (
              <TabsTrigger
                key={competency.competencyName}
                value={competency.competencyName}
                className="flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="truncate">{competency.competencyName}</span>
                <Badge
                  variant="secondary"
                  className="ml-2 text-xs bg-primary/10 text-primary border-primary/20"
                >
                  {Math.round(competency.progressPercentage)}%
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {competencyGroups.map((competency) => (
            <TabsContent
              key={competency.competencyName}
              value={competency.competencyName}
              className="mt-6"
            >
              <CompetencyTab competency={competency} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
