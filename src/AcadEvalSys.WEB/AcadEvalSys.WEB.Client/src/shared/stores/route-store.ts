import { create } from "zustand";

export interface BreadcrumbItem {
  label: string;
  path: string | null;
  isActive?: boolean;
}

type RouteState = {
  currentPath: string;
  navigationContext: {
    careerId?: string;
    subjectId?: string;
    evaluationId?: string;
  };
  breadcrumbs: BreadcrumbItem[];
  setCurrentPath: (path: string) => void;
  setNavigationContext: (
    context: Partial<RouteState["navigationContext"]>
  ) => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
};

export const useRouteStore = create<RouteState>((set) => ({
  currentPath: "/",
  navigationContext: {},
  breadcrumbs: [],

  setCurrentPath: (path: string) => set({ currentPath: path }),

  setNavigationContext: (context: Partial<RouteState["navigationContext"]>) =>
    set((state) => ({
      navigationContext: { ...state.navigationContext, ...context },
    })),

  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => set({ breadcrumbs }),
}));
