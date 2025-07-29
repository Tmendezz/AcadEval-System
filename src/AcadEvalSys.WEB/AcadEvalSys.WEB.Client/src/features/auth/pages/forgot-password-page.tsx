import { Card, CardContent } from "@/shared/components/ui/card";
import { ForgotPasswordForm } from "../components/forgot-password.form";
import { AuthCardHeader } from "../components/auth-card-header";

export const ForgotPasswordPage = () => (
  <Card className="w-full max-w-md mx-auto bg-white backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-2xl">
    <AuthCardHeader
      title="Recuperar Contraseña"
      subtitle="Ingrese su correo académico para recuperar su contraseña"
    />

    <CardContent className="px-8 pb-6">
      <ForgotPasswordForm />
    </CardContent>
  </Card>
);
