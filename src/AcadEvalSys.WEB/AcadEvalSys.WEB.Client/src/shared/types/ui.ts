import { ElementType } from "react";

export interface NavItem {
  href: string;
  icon: ElementType;
  label: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
  className?: string;
}

// Base trend interface
export interface Trend {
  value: number;
  isPositive: boolean;
}

export interface StatItem {
  label: string;
  value: number;
  icon?: string;
  trend?: Trend;
}

// Base statistics item configuration
export interface StatisticsItemConfig<T> {
  key: string;
  label: string;
  calculate: (data: T[]) => number;
  icon?: string;
  trend?: (data: T[]) => Trend;
}

export interface StatisticsConfig<T> {
  items: StatisticsItemConfig<T>[];
}

export interface FilterOptions<T> {
  data: T[];
  filters: Record<string, any>;
  filterFn: (item: T, filters: Record<string, any>) => boolean;
}

export interface FilterConfig<T> {
  searchFields: (keyof T)[];
  filterFields: Record<string, (item: T, value: any) => boolean>;
  sortFields?: Record<string, (a: T, b: T) => number>;
}
