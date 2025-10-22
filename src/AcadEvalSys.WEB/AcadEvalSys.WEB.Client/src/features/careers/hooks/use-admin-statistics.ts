import { useMemo } from "react";
import { Subject } from "@/features/careers/models/subject";
import { TechnicalCareer } from "@/features/careers/models/technical-career";
import { CareerYear, getCareerYearLabel } from "@/features/careers/models/enums";
import { useYearConverter } from "@/shared/hooks/use-year-converter";
type AdminStatistics = {
  totalStudents: number;
  totalProfessors: number;
  totalCareers: number;
  totalYears: number;
};

type CareerStatistics = {
  id: string;
  name: string;
  fullName: string;
  totalStudents: number;
  totalProfessors: number;
};

type YearStatistics = {
  value: CareerYear;
  label: string;
  count: number;
  active: boolean;
};

export const useAdminStatistics = (
  subjects: Subject[],
  careers: TechnicalCareer[],
  selectedYear?: CareerYear
) => {
  const { getYearNumber } = useYearConverter();

  const stats = useMemo((): AdminStatistics => {
    const totalStudents = subjects.reduce(
      (sum: number, subject: Subject) => sum + (subject.enrolledStudents?.length || 0),
      0
    );
    const totalProfessors = 72; // Mock data for now
    const totalCareers = careers.length;
    const totalYears = 3;

    return {
      totalStudents,
      totalProfessors,
      totalCareers,
      totalYears,
    };
  }, [careers, subjects]);

  const careerStats = useMemo((): CareerStatistics[] => {
    return careers.map((career) => {
      const careerSubjects = subjects.filter((subject: Subject) => {
        const tcName = (subject as any).technicalCareerName as string | undefined;
        return tcName ? tcName === career.name : false;
      });
      const totalStudents = careerSubjects.reduce(
        (sum: number, subject: Subject) => sum + (subject.enrolledStudents?.length || 0),
        0
      );
      const totalProfessors = 18; // Mock data for now

      return {
        id: career.id,
        name: career.name,
        fullName: `Tecnicatura Superior en ${career.name}`,
        totalStudents,
        totalProfessors,
      };
    });
  }, [careers, subjects]);

  const yearStats = useMemo((): YearStatistics[] => {
    const stats = [
      {
        value: CareerYear.First,
        label: getCareerYearLabel(CareerYear.First),
        count: subjects.filter(
          (s: Subject) => getYearNumber(s.year) === CareerYear.First
        ).length,
        active: selectedYear === CareerYear.First,
      },
      {
        value: CareerYear.Second,
        label: getCareerYearLabel(CareerYear.Second),
        count: subjects.filter(
          (s: Subject) => getYearNumber(s.year) === CareerYear.Second
        ).length,
        active: selectedYear === CareerYear.Second,
      },
      {
        value: CareerYear.Third,
        label: getCareerYearLabel(CareerYear.Third),
        count: subjects.filter(
          (s: Subject) => getYearNumber(s.year) === CareerYear.Third
        ).length,
        active: selectedYear === CareerYear.Third,
      },
    ];

    return stats;
  }, [subjects, selectedYear, getYearNumber]);

  return {
    stats,
    careerStats,
    yearStats,
  };
};
