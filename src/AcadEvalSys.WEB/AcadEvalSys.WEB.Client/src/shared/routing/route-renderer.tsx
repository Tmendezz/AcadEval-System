import React, { Suspense } from "react";
import { Route } from "wouter";
import { AdminRoute, ProtectedRoute } from "@/features/auth/components";
import { RouteConfig } from "./route-config";
import { UserRole } from "@/features/auth/models";
import { PageLoader } from "@/shared/components/ui/page-loader";

interface RouteRendererProps {
  route: RouteConfig;
  userRole?: UserRole;
}

export const RouteRenderer: React.FC<RouteRendererProps> = ({ route }) => {
  const { path, component: Component, requiredRoles, isAdminOnly } = route;

  if (isAdminOnly) {
    return (
      <Route path={path}>
        <AdminRoute>
          <Suspense fallback={<PageLoader />}>
            <Component />
          </Suspense>
        </AdminRoute>
      </Route>
    );
  }

  if (requiredRoles && requiredRoles.length > 0) {
    return (
      <Route path={path}>
        <ProtectedRoute requiredRoles={requiredRoles}>
          <Suspense fallback={<PageLoader />}>
            <Component />
          </Suspense>
        </ProtectedRoute>
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
};

interface RouteListProps {
  routes: RouteConfig[];
  userRole?: UserRole;
}

export const RouteList: React.FC<RouteListProps> = ({ routes, userRole }) => {
  return (
    <>
      {routes.map((route) => (
        <RouteRenderer key={route.path} route={route} userRole={userRole} />
      ))}
    </>
  );
};

// Función helper para renderizar rutas directamente (para usar con Switch de wouter)
export const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route) => {
    const { path, component: Component, requiredRoles, isAdminOnly } = route;

    if (isAdminOnly) {
      return (
        <Route key={path} path={path}>
          <AdminRoute>
            <Suspense fallback={<PageLoader />}>
              <Component />
            </Suspense>
          </AdminRoute>
        </Route>
      );
    }

    if (requiredRoles && requiredRoles.length > 0) {
      return (
        <Route key={path} path={path}>
          <ProtectedRoute requiredRoles={requiredRoles}>
            <Suspense fallback={<PageLoader />}>
              <Component />
            </Suspense>
          </ProtectedRoute>
        </Route>
      );
    }

    return <Route key={path} path={path} component={Component} />;
  });
};
