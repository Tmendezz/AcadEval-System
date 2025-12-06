import { Suspense } from "react";
import { Switch, Route } from "wouter";
import { AppLayout } from "./shared/components/layout";
import { PageLoader } from "./shared/components/ui/page-loader";
import { routes, renderRoutes } from "./shared/routing";

export function App() {
  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          {renderRoutes(routes)}

          <Route path="/:rest*">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-gray-600">Página no encontrada</p>
              </div>
            </div>
          </Route>
        </Switch>
      </Suspense>
    </AppLayout>
  );
}
