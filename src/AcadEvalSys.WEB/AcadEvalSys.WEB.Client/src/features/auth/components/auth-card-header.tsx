import { CardHeader, CardTitle } from "@/shared/components/ui/card";
import logoLoginMOL from "@/assets/logo_login_MOL.png";

interface AuthCardHeaderProps {
  title: string;
  subtitle?: string;
}

export const AuthCardHeader = ({ title, subtitle }: AuthCardHeaderProps) => {
  return (
    <CardHeader className="text-center flex flex-col items-center p-8 pb-6">
      <img
        src={logoLoginMOL}
        alt="Logo Instituto Tecnológico El Molino"
        className="mb-4 w-auto h-14"
      />

      <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
        {title}
      </CardTitle>

      {subtitle && (
        <p className="text-sm text-gray-600 text-center font-medium">
          {subtitle}
        </p>
      )}
    </CardHeader>
  );
};
