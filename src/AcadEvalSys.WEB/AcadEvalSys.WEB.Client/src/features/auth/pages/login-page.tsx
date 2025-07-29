import { Card, CardContent } from "@/shared/components/ui/card";
import { LoginForm } from "../components/login-form";
import { AuthCardHeader } from "../components/auth-card-header";

export function LoginPage() {
  return (
    <Card className="w-full max-w-md mx-auto bg-white backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-2xl">
      <AuthCardHeader
        title="Sistema de Encuestas y Evaluaciones por Competencias"
        subtitle="Ingrese sus credenciales para acceder al sistema"
      />

      <CardContent className="px-8 pb-6">
        <LoginForm />
      </CardContent>
    </Card>
  );
}
