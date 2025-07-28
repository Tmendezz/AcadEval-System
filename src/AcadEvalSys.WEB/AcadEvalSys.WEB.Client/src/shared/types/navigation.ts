export interface NavigationConfig {
  basePath: string;
  routes: Record<string, string>;
}

export interface ModuleNavigationConfig {
  [moduleName: string]: NavigationConfig;
}

export interface UrlParamConfig {
  [key: string]: {
    after: string;
    required?: boolean;
  };
}

export interface RouteInfo {
  section: string;
  page: string;
  path: string;
  parent?: string;
}

export interface RouteConfig {
  [path: string]: RouteInfo;
}

export interface BreadcrumbItem {
  label: string;
  path: string | null;
}
