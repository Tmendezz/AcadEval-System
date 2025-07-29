import { EntityCard } from "@/shared/components/ui/entity-card";
import { TechnicalCareer } from "../types/technical-career";
import { CareerStatistics } from "../hooks/use-admin-statistics";
import { Users, GraduationCap } from "lucide-react";

interface CareerListProps {
  careerStats: CareerStatistics[];
  onCareerClick: (career: TechnicalCareer) => void;
  className?: string;
}

export const CareerList = ({
  careerStats,
  onCareerClick,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
}: CareerListProps) => {
  return (
    <div className={className}>
      {careerStats.map((career) => (
        <EntityCard
          key={career.id}
          title={career.fullName}
          subtitle={`${career.totalStudents} estudiantes • ${career.totalProfessors} profesores`}
          stats={[
            {
              icon: <Users className="w-4 h-4" />,
              label: "Estudiantes",
              value: career.totalStudents,
            },
            {
              icon: <GraduationCap className="w-4 h-4" />,
              label: "Profesores",
              value: career.totalProfessors,
            },
          ]}
          onClick={() => onCareerClick({ id: career.id, name: career.name })}
        />
      ))}
    </div>
  );
};
