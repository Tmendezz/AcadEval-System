import { useMemo } from "react";
import { Subject } from "../types/subject";
import { TechnicalCareer } from "../types/technical-career";
import { CareerYear, CareerYearLabels } from "@/shared/types/enums";
import { useYearConverter } from "@/shared/hooks/use-year-converter";
import {
  AdminStatistics,
  CareerStatistics,
  YearStatistics,
} from "@/shared/types/statistics";

export const useAdminStatistics = (
  subjects: Subject[],
  careers: TechnicalCareer[],
  selectedYear?: CareerYear
) => {
  const { getYearNumber } = useYearConverter();

  const stats = useMemo((): AdminStatistics => {
    const totalStudents = subjects.reduce(
      (sum: number, subject: Subject) =>
        sum + (subject.totalStudents || subject.enrolledStudents?.length || 0),
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
      const careerSubjects = subjects.filter(
        (subject: Subject) => subject.technicalCareer === career.name
      );
      const totalStudents = careerSubjects.reduce(
        (sum: number, subject: Subject) =>
          sum +
          (subject.totalStudents || subject.enrolledStudents?.length || 0),
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
        label: CareerYearLabels[CareerYear.First],
        count: subjects.filter(
          (s: Subject) => getYearNumber(s.year) === CareerYear.First
        ).length,
        active: selectedYear === CareerYear.First,
      },
      {
        value: CareerYear.Second,
        label: CareerYearLabels[CareerYear.Second],
        count: subjects.filter(
          (s: Subject) => getYearNumber(s.year) === CareerYear.Second
        ).length,
        active: selectedYear === CareerYear.Second,
      },
      {
        value: CareerYear.Third,
        label: CareerYearLabels[CareerYear.Third],
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
