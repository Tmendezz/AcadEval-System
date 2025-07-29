import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";

interface AuthButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const AuthButton = ({
  children,
  isLoading = false,
  loadingText = "Cargando...",
  type = "submit",
  disabled = false,
  onClick,
  className = "",
}: AuthButtonProps) => {
  return (
    <Button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
