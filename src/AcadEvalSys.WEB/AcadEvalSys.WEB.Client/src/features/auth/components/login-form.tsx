import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/shared/auth/hooks/use-login-mutation";
import { Link } from "wouter";
import { AuthButton } from "./auth-button";
import { Form, FormField, FormMessage } from "@/shared/components/ui/form";
import { FormItem } from "@/shared/components/ui/form";
import { FormLabel } from "@/shared/components/ui/form";
import { FormControl } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { getErrorMessage } from "@/shared/lib/error-handler";

const loginSchema = z.object({
  email: z.string().email("Ingrese un correo académico válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control } = form;

  const {
    mutate: login,
    isPending: isLoading,
    error: loginError,
  } = useLoginMutation();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error("Error en submit:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Correo académico
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="usuario@itec-elmolino.edu.ar"
                  disabled={isLoading}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Contraseña
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••••••••"
                  disabled={isLoading}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {loginError && (
          <div className="text-red-700 text-sm text-center p-3 bg-red-50 border border-red-200 rounded-lg">
            {getErrorMessage(loginError)}
          </div>
        )}

        <AuthButton isLoading={isLoading} loadingText="Iniciando sesión...">
          Ingresar
        </AuthButton>

        <div className="text-center pt-4">
          <Link
            href="/auth/forgot-password"
            className="text-blue-600 hover:text-blue-700 text-sm underline-offset-4 hover:underline transition-colors duration-200"
          >
            ¿Olvidó su contraseña? - Recuperar contraseña
          </Link>
        </div>
      </form>
    </Form>
  );
};
