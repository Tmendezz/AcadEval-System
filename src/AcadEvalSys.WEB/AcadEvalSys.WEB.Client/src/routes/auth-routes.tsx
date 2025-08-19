import { Redirect, Route, Switch } from "wouter";
import { AuthLayout } from "../features/auth/components/auth-layout";
import { LoginPage } from "../features/auth/pages/login-page";
import { ForgotPasswordPage } from "@/features/auth/pages/forgot-password-page";
import { useAuthStore } from "@/features/auth/store";

// Componente para página de recuperación de contraseña

export function AuthRoutes() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <AuthLayout>
      <Switch>
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
        <Route path="/*" component={LoginPage} />
      </Switch>
    </AuthLayout>
  );
}
