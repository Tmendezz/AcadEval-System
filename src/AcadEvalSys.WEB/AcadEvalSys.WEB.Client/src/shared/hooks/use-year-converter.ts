import { useCallback } from "react";

export const useYearConverter = () => {
  const getYearNumber = useCallback((year: string | number): number => {
    if (typeof year === "number") return year;

    const yearMap: Record<string, number> = {
      First: 1,
      Second: 2,
      Third: 3,
    };

    return yearMap[year] || 1;
  }, []);

  const getYearString = useCallback((year: number): string => {
    const yearMap: Record<number, string> = {
      1: "First",
      2: "Second",
      3: "Third",
    };

    return yearMap[year] || "First";
  }, []);

  return { getYearNumber, getYearString };
};
