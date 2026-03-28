import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, CheckCircle, Clock, Wrench } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  ServiceStatus,
  useGetAllBookings,
  useListVehicles,
} from "../hooks/useQueries";

export default function AdminDashboardPage() {
  const { data: vehicles, isLoading: vLoading } = useListVehicles();
  const { data: bookings, isLoading: bLoading } = useGetAllBookings();

  const stats = useMemo(
    () => ({
      totalVehicles: vehicles?.length ?? 0,
      pending:
        bookings?.filter((b) => b.status === ServiceStatus.pending).length ?? 0,
      inProgress:
        bookings?.filter((b) => b.status === ServiceStatus.inProgress).length ??
        0,
      completed:
        bookings?.filter((b) => b.status === ServiceStatus.completed).length ??
        0,
    }),
    [vehicles, bookings],
  );

  const statCards = [
    {
      label: "Total Vehicles",
      value: stats.totalVehicles,
      icon: Car,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Wrench,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  const isLoading = vLoading || bLoading;

  const statusLabel = (s: ServiceStatus) =>
    s === ServiceStatus.completed
      ? "Completed"
      : s === ServiceStatus.inProgress
        ? "In Progress"
        : "Pending";

  const statusClass = (s: ServiceStatus) =>
    s === ServiceStatus.completed
      ? "bg-green-500/20 text-green-400"
      : s === ServiceStatus.inProgress
        ? "bg-blue-500/20 text-blue-400"
        : "bg-yellow-500/20 text-yellow-400";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of Swamy Ayyappa Motors operations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            data-ocid="admin.stats.card"
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <span className={`text-3xl font-bold ${color}`}>
                      {value}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="font-serif text-xl font-bold text-foreground mb-4">
          Recent Bookings
        </h2>
        {isLoading ? (
          <div className="space-y-3" data-ocid="admin.bookings.loading_state">
            {["a", "b", "c"].map((k) => (
              <Skeleton key={k} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {!bookings || bookings.length === 0 ? (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="admin.bookings.empty_state"
              >
                No bookings yet.
              </div>
            ) : (
              bookings.slice(0, 5).map((b, i) => (
                <div
                  key={String(b.id)}
                  className="flex items-center justify-between px-5 py-4 border-b border-border/50 last:border-0"
                  data-ocid={`admin.bookings.item.${i + 1}`}
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {b.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.vehicleNumberPlate} · {b.serviceType}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${statusClass(b.status)}`}
                  >
                    {statusLabel(b.status)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
