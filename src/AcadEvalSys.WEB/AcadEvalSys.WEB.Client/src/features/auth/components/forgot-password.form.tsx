import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { AuthButton } from "./auth-button";
import { Input } from "@/shared/components/ui/input";

const formSchema = z.object({
  email: z.string().email("Ingrese un correo válido"),
});

export const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // TODO: Implementar lógica de recuperación
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
                  disabled={false}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AuthButton>Recuperar contraseña</AuthButton>

        <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-gray-600">
            Si hay un problema con el correo académico, contacte a secretaría.
          </p>

          <Link href="/auth/login">
            <a className="text-blue-600 hover:text-blue-700 text-sm font-medium underline-offset-4 hover:underline transition-colors duration-200">
              ← Volver al inicio de sesión
            </a>
          </Link>
        </div>
      </form>
    </Form>
  );
};
