import { cn } from "@infrastructure/lib/cn";

interface StatusBadgeProps {
  status: "active" | "completed" | "upcoming" | "cancelled" | "default";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: StatusBadgeProps["status"]) => {
    switch (status) {
      case "completed":
        return {
          label: "Completada",
          className: "bg-green-100 text-green-800 border-green-200",
          dotColor: "bg-green-500",
        };
      case "active":
        return {
          label: "En progreso",
          className: "bg-blue-100 text-blue-800 border-blue-200",
          dotColor: "bg-blue-500",
        };
      case "upcoming":
        return {
          label: "Próxima",
          className: "bg-amber-100 text-amber-800 border-amber-200",
          dotColor: "bg-amber-500",
        };
      case "cancelled":
        return {
          label: "Cancelada",
          className: "bg-red-100 text-red-800 border-red-200",
          dotColor: "bg-red-500",
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-800 border-gray-200",
          dotColor: "bg-gray-500",
        };
    }
  };

  const { label, className, dotColor } = getStatusConfig(status);

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        className
      )}
    >
      <div className={cn("w-2 h-2 rounded-full mr-1.5", dotColor)} />
      {label}
    </div>
  );
}
