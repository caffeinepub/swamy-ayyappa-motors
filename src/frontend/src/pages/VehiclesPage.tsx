import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  type Vehicle,
  VehicleCategory,
  useListVehicles,
} from "../hooks/useQueries";

const VEHICLE_IMAGES = [
  "/assets/generated/vehicle-activa.dim_600x400.jpg",
  "/assets/generated/vehicle-royal-enfield.dim_600x400.jpg",
  "/assets/generated/vehicle-apache.dim_600x400.jpg",
];

const SAMPLE_VEHICLES: (Vehicle & { id: bigint })[] = [
  {
    id: 1n,
    name: "Honda Activa 6G",
    model: "Activa 6G",
    year: 2024n,
    category: VehicleCategory.new_,
    price: 74500n,
    description:
      "India's #1 scooter — fuel-efficient, reliable, and stylish. Ideal for city commuting.",
    available: true,
  },
  {
    id: 2n,
    name: "Royal Enfield Classic 350",
    model: "Classic 350",
    year: 2023n,
    category: VehicleCategory.new_,
    price: 193000n,
    description:
      "Iconic motorcycle with modern mechanicals. Timeless design meets contemporary engineering.",
    available: true,
  },
  {
    id: 3n,
    name: "TVS Apache RTR 160",
    model: "Apache RTR 160",
    year: 2023n,
    category: VehicleCategory.used,
    price: 85000n,
    description:
      "Sporty commuter with race-derived performance. Well-maintained, single owner.",
    available: true,
  },
  {
    id: 4n,
    name: "Bajaj Pulsar NS200",
    model: "Pulsar NS200",
    year: 2024n,
    category: VehicleCategory.new_,
    price: 142000n,
    description:
      "Naked street fighter with liquid-cooled engine. Thrilling performance for enthusiasts.",
    available: true,
  },
  {
    id: 5n,
    name: "Hero Splendor Plus",
    model: "Splendor Plus",
    year: 2022n,
    category: VehicleCategory.used,
    price: 52000n,
    description:
      "Most popular motorcycle in India. Excellent fuel economy and low maintenance cost.",
    available: true,
  },
  {
    id: 6n,
    name: "Yamaha FZ-S V3",
    model: "FZ-S V3",
    year: 2023n,
    category: VehicleCategory.new_,
    price: 115000n,
    description:
      "Sporty street motorcycle with fuel injection and ABS. Sleek design, nimble handling.",
    available: true,
  },
];

type FilterType = "all" | "new" | "used";

function VehicleCard({
  vehicle,
  image,
}: { vehicle: Vehicle & { id: bigint }; image: string }) {
  const isNew = vehicle.category === VehicleCategory.new_;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors group"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge
            className={
              isNew
                ? "bg-primary text-primary-foreground"
                : "bg-accent/20 text-accent border-accent/30"
            }
          >
            {isNew ? "New" : "Used"}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif font-bold text-foreground text-lg mb-1">
          {vehicle.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-1">
          {vehicle.model} · {String(vehicle.year)}
        </p>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {vehicle.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-accent text-xl">
            ₹{Number(vehicle.price).toLocaleString("en-IN")}
          </span>
          <Link to="/book-service">
            <Button
              size="sm"
              className="bg-primary hover:bg-maroon-light text-primary-foreground"
            >
              Book Service
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function VehiclesPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { data: backendVehicles, isLoading } = useListVehicles();

  const vehicles = (
    backendVehicles && backendVehicles.length > 0
      ? backendVehicles.map((v, i) => ({ ...v, id: BigInt(i) }))
      : SAMPLE_VEHICLES
  ).filter((v) => {
    if (filter === "new") return v.category === VehicleCategory.new_;
    if (filter === "used") return v.category === VehicleCategory.used;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
          Our <span className="text-accent">Vehicles</span>
        </h1>
        <p className="text-muted-foreground">
          Browse our collection of new and pre-owned two-wheelers
        </p>
      </div>

      <div className="flex gap-2 mb-8" data-ocid="vehicles.filter.tab">
        {(["all", "new", "used"] as FilterType[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            className={
              filter === f
                ? "bg-primary text-primary-foreground"
                : "border-border text-muted-foreground"
            }
            onClick={() => setFilter(f)}
            data-ocid={`vehicles.${f}.tab`}
          >
            {f === "all" ? "All" : f === "new" ? "New" : "Used"}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="vehicles.loading_state"
        >
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <div
              key={k}
              className="bg-card rounded-lg border border-border overflow-hidden"
            >
              <Skeleton className="aspect-video w-full" />
              <div className="p-5 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16" data-ocid="vehicles.empty_state">
          <p className="text-muted-foreground text-lg">
            No vehicles found for this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle, i) => (
            <div key={String(vehicle.id)} data-ocid={`vehicles.item.${i + 1}`}>
              <VehicleCard
                vehicle={vehicle}
                image={VEHICLE_IMAGES[i % VEHICLE_IMAGES.length]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
