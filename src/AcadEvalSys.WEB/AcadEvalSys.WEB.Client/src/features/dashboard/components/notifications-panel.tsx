import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Bell, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

interface Notification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  isLoading?: boolean;
  className?: string;
}

const notificationIcons = {
  info: Info,
  warning: AlertCircle,
  error: XCircle,
  success: CheckCircle,
};

const notificationColors = {
  info: "text-blue-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  success: "text-green-500",
};

export function NotificationsPanel({
  notifications,
  isLoading = false,
  className,
}: NotificationsPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificaciones
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-sm">No hay notificaciones</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              return (
                <div
                  key={notification.id}
                  className={`border-l-2 pl-3 ${
                    notification.read ? "opacity-60" : "border-primary"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Icon
                      className={`h-4 w-4 mt-0.5 ${
                        notificationColors[notification.type]
                      }`}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        {notification.message}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
