import { useMemo } from "react";
import { StatItem, StatisticsConfig } from "@/shared/types";

export const useStatistics = <T>(data: T[], config: StatisticsConfig<T>) => {
  const stats = useMemo(() => {
    return config.items.map((item) => ({
      key: item.key,
      label: item.label,
      value: item.calculate(data),
      icon: item.icon,
      trend: item.trend ? item.trend(data) : undefined,
    }));
  }, [data, config]);

  return { stats };
};

// Hook específico para estadísticas de entidades con estudiantes
export const useEntityStatistics = <
  T extends { totalStudents?: number; enrolledStudents?: any[] }
>(
  entities: T[]
) => {
  const stats = useMemo(() => {
    const totalStudents = entities.reduce(
      (sum, entity) =>
        sum + (entity.totalStudents || entity.enrolledStudents?.length || 0),
      0
    );

    const totalEntities = entities.length;

    return {
      totalStudents,
      totalEntities,
      averageStudentsPerEntity:
        totalEntities > 0 ? Math.round(totalStudents / totalEntities) : 0,
    };
  }, [entities]);

  return stats;
};
