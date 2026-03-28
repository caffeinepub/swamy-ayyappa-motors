import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";
import {
  type ServiceBooking,
  ServiceStatus,
  useGetAllBookings,
  useUpdateBookingStatus,
} from "../hooks/useQueries";

const STATUS_OPTIONS = [
  { value: ServiceStatus.pending, label: "Pending" },
  { value: ServiceStatus.inProgress, label: "In Progress" },
  { value: ServiceStatus.completed, label: "Completed" },
];

const STATUS_COLOR: Record<ServiceStatus, string> = {
  [ServiceStatus.pending]:
    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  [ServiceStatus.inProgress]: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  [ServiceStatus.completed]:
    "bg-green-500/20 text-green-400 border-green-500/30",
};

type FilterType = "all" | ServiceStatus;

export default function AdminBookingsPage() {
  const { data: bookings, isLoading } = useGetAllBookings();
  const updateStatus = useUpdateBookingStatus();
  const [filter, setFilter] = useState<FilterType>("all");

  const handleStatusChange = async (
    booking: ServiceBooking,
    newStatus: ServiceStatus,
  ) => {
    try {
      await updateStatus.mutateAsync({ id: booking.id, status: newStatus });
      toast.success("Status updated!");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const filtered =
    bookings?.filter((b) => filter === "all" || b.status === filter) ?? [];

  const filterLabels: Record<FilterType, string> = {
    all: "All",
    [ServiceStatus.pending]: "Pending",
    [ServiceStatus.inProgress]: "In Progress",
    [ServiceStatus.completed]: "Completed",
  };

  const statusLabel = (s: ServiceStatus) =>
    s === ServiceStatus.completed
      ? "Completed"
      : s === ServiceStatus.inProgress
        ? "In Progress"
        : "Pending";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Bookings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all service bookings
          </p>
        </div>

        <div className="flex gap-2" data-ocid="bookings.filter.tab">
          {(
            [
              "all",
              ServiceStatus.pending,
              ServiceStatus.inProgress,
              ServiceStatus.completed,
            ] as FilterType[]
          ).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="bookings.tab"
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="bookings.loading_state">
          {["a", "b", "c", "d", "e"].map((k) => (
            <Skeleton key={k} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table data-ocid="bookings.table">
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/30">
                <TableHead className="text-muted-foreground">
                  Customer
                </TableHead>
                <TableHead className="text-muted-foreground">Phone</TableHead>
                <TableHead className="text-muted-foreground">
                  Vehicle No.
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Service Type
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Preferred Date
                </TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">
                  Update Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="bookings.empty_state"
                  >
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((b, i) => (
                  <TableRow
                    key={String(b.id)}
                    className="border-border hover:bg-muted/20"
                    data-ocid={`bookings.item.${i + 1}`}
                  >
                    <TableCell className="text-foreground font-medium">
                      {b.customerName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {b.phone}
                    </TableCell>
                    <TableCell className="text-foreground font-mono">
                      {b.vehicleNumberPlate}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {b.serviceType}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {b.preferredDate}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          STATUS_COLOR[b.status] ??
                          STATUS_COLOR[ServiceStatus.pending]
                        }
                      >
                        {statusLabel(b.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={b.status}
                        onValueChange={(v) =>
                          handleStatusChange(b, v as ServiceStatus)
                        }
                      >
                        <SelectTrigger
                          className="w-36 h-8 bg-input border-border text-xs"
                          data-ocid={`bookings.select.${i + 1}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {STATUS_OPTIONS.map((o) => (
                            <SelectItem
                              key={o.value}
                              value={o.value}
                              className="text-xs"
                            >
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
