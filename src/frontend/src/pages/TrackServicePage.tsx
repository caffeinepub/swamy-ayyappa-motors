import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, Loader2, Search, Wrench } from "lucide-react";
import { useState } from "react";
import {
  type ServiceBooking,
  ServiceStatus,
  useGetBookingsByPlate,
} from "../hooks/useQueries";

const STATUS_CONFIG: Record<
  ServiceStatus,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  [ServiceStatus.pending]: {
    label: "Pending",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: Clock,
  },
  [ServiceStatus.inProgress]: {
    label: "In Progress",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Wrench,
  },
  [ServiceStatus.completed]: {
    label: "Completed",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: CheckCircle,
  },
};

function BookingCard({ booking }: { booking: ServiceBooking }) {
  const cfg =
    STATUS_CONFIG[booking.status] ?? STATUS_CONFIG[ServiceStatus.pending];
  const Icon = cfg.icon;
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-foreground">{booking.serviceType}</p>
          <p className="text-sm text-muted-foreground">#{String(booking.id)}</p>
        </div>
        <Badge className={`${cfg.color} flex items-center gap-1`}>
          <Icon className="w-3 h-3" />
          {cfg.label}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Customer</p>
          <p className="text-foreground font-medium">{booking.customerName}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Phone</p>
          <p className="text-foreground font-medium">{booking.phone}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Vehicle</p>
          <p className="text-foreground font-mono font-medium">
            {booking.vehicleNumberPlate}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Preferred Date</p>
          <p className="text-foreground font-medium">{booking.preferredDate}</p>
        </div>
      </div>
    </div>
  );
}

export default function TrackServicePage() {
  const [inputPlate, setInputPlate] = useState("");
  const [searchPlate, setSearchPlate] = useState("");

  const {
    data: bookings,
    isLoading,
    isFetched,
  } = useGetBookingsByPlate(searchPlate);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPlate(inputPlate.trim().toUpperCase());
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            Track <span className="text-accent">Service</span>
          </h1>
          <p className="text-muted-foreground">
            Enter your vehicle number plate to check service status
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <Input
            value={inputPlate}
            onChange={(e) => setInputPlate(e.target.value)}
            placeholder="e.g. TS11AB1234"
            className="bg-input border-border font-mono uppercase flex-1"
            data-ocid="track.search_input"
          />
          <Button
            type="submit"
            className="bg-primary text-primary-foreground"
            data-ocid="track.primary_button"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span className="ml-2 hidden sm:inline">Search</span>
          </Button>
        </form>

        {isLoading && (
          <div className="text-center py-12" data-ocid="track.loading_state">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          </div>
        )}

        {!isLoading &&
          isFetched &&
          searchPlate &&
          (bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {bookings.length} booking(s) found for{" "}
                <span className="text-accent font-mono">{searchPlate}</span>
              </p>
              {bookings.map((booking, i) => (
                <div key={String(booking.id)} data-ocid={`track.item.${i + 1}`}>
                  <BookingCard booking={booking} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-ocid="track.empty_state">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">No bookings found</p>
              <p className="text-muted-foreground text-sm">
                No service records found for{" "}
                <span className="font-mono">{searchPlate}</span>
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
