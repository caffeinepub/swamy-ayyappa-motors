import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateBooking } from "../hooks/useQueries";

const SERVICE_TYPES = [
  "General Service",
  "Oil Change",
  "Brake Service",
  "Tyre Change",
  "Battery Replacement",
  "Engine Repair",
  "Body Work",
  "Other",
];

export default function BookServicePage() {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    vehicleNumberPlate: "",
    serviceType: "",
    preferredDate: "",
  });
  const [bookingId, setBookingId] = useState<bigint | null>(null);
  const createBooking = useCreateBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceType) {
      toast.error("Please select a service type");
      return;
    }
    try {
      const id = await createBooking.mutateAsync(form);
      setBookingId(id);
      toast.success("Booking created successfully!");
    } catch {
      toast.error("Failed to create booking. Please try again.");
    }
  };

  if (bookingId !== null) {
    return (
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
          data-ocid="booking.success_state"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-muted-foreground mb-4">
            Your service has been booked successfully.
          </p>
          <div className="bg-secondary rounded-lg p-4 border border-border mb-6">
            <p className="text-muted-foreground text-sm">Booking ID</p>
            <p className="font-mono font-bold text-accent text-2xl">
              #{String(bookingId)}
            </p>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            Use your vehicle number plate to track your service status.
          </p>
          <Button
            onClick={() => {
              setBookingId(null);
              setForm({
                customerName: "",
                phone: "",
                vehicleNumberPlate: "",
                serviceType: "",
                preferredDate: "",
              });
            }}
            className="bg-primary text-primary-foreground"
            data-ocid="booking.secondary_button"
          >
            Book Another Service
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            Book a <span className="text-accent">Service</span>
          </h1>
          <p className="text-muted-foreground">
            Fill in the details below to schedule your vehicle service
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          data-ocid="booking.panel"
        >
          <div className="space-y-2">
            <Label htmlFor="customerName" className="text-foreground">
              Customer Name
            </Label>
            <Input
              id="customerName"
              value={form.customerName}
              onChange={(e) =>
                setForm((p) => ({ ...p, customerName: e.target.value }))
              }
              placeholder="Enter your full name"
              required
              className="bg-input border-border"
              data-ocid="booking.input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="+91 XXXXX XXXXX"
              required
              className="bg-input border-border"
              data-ocid="booking.input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleNumberPlate" className="text-foreground">
              Vehicle Number Plate
            </Label>
            <Input
              id="vehicleNumberPlate"
              value={form.vehicleNumberPlate}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  vehicleNumberPlate: e.target.value.toUpperCase(),
                }))
              }
              placeholder="e.g. TS11AB1234"
              required
              className="bg-input border-border font-mono uppercase"
              data-ocid="booking.input"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Service Type</Label>
            <Select
              value={form.serviceType}
              onValueChange={(v) => setForm((p) => ({ ...p, serviceType: v }))}
            >
              <SelectTrigger
                className="bg-input border-border"
                data-ocid="booking.select"
              >
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {SERVICE_TYPES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredDate" className="text-foreground">
              Preferred Date
            </Label>
            <Input
              id="preferredDate"
              type="date"
              value={form.preferredDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, preferredDate: e.target.value }))
              }
              required
              min={new Date().toISOString().split("T")[0]}
              className="bg-input border-border"
              data-ocid="booking.input"
            />
          </div>

          <Button
            type="submit"
            disabled={createBooking.isPending}
            className="w-full bg-primary hover:bg-maroon-light text-primary-foreground"
            data-ocid="booking.submit_button"
          >
            {createBooking.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {createBooking.isPending ? "Booking..." : "Book Service"}
          </Button>
        </form>
      </div>
    </div>
  );
}
