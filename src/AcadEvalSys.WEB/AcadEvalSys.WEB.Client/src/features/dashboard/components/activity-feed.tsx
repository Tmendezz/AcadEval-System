import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Activity } from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  isLoading?: boolean;
  className?: string;
}

export function ActivityFeed({
  activities,
  isLoading = false,
  className,
}: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Actividad Reciente
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
          <Activity className="h-5 w-5" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No hay actividad reciente
          </p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="border-l-2 border-primary pl-3">
                <h4 className="font-medium text-sm">{activity.title}</h4>
                <p className="text-muted-foreground text-xs">
                  {activity.description}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
