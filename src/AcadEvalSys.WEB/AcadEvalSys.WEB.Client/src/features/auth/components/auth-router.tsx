import { Redirect, Route, Switch } from "wouter";
import { useAuthRouter } from "@/features/auth/hooks/use-auth-router";
import { SessionLoadingScreen } from "@/shared/components/loading-screen";
import { App } from "@/App";
import { AuthLayout } from "./auth-layout";
import { LoginPage } from "../pages/login-page";
import { ForgotPasswordPage } from "../pages/forgot-password-page";

export function AuthRouter() {
  const { 
    isCheckingSession, 
    shouldShowAuthRoutes, 
    shouldShowAppRoutes 
  } = useAuthRouter();

  if (isCheckingSession) {
    return <SessionLoadingScreen />;
  }

  if (shouldShowAppRoutes) {
    return <App />;
  }

  if (shouldShowAuthRoutes) {
    return (
      <AuthLayout>
        <Switch>
          <Route path="/auth/login" component={LoginPage} />
          <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
          <Redirect to="/auth/login" />
        </Switch>
      </AuthLayout>
    );
  }

  return <SessionLoadingScreen />;
} 