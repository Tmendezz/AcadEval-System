import React from "react";
import { Route } from "wouter";
import { AdminRoute, ProtectedRoute } from "@/features/auth/components";
import { UserRole } from "@infrastructure/api/types/auth";
import { RouteConfig } from "./route-config";

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
          <Component />
        </AdminRoute>
      </Route>
    );
  }

  if (requiredRoles && requiredRoles.length > 0) {
    return (
      <Route path={path}>
        <ProtectedRoute requiredRoles={requiredRoles}>
          <Component />
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
