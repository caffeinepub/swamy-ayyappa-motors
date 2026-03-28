import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ServiceBooking,
  ServiceStatus,
  type Vehicle,
  VehicleCategory,
} from "../backend";
import { useActor } from "./useActor";

export { ServiceStatus, VehicleCategory };
export type { Vehicle, ServiceBooking };

export function useListVehicles() {
  const { actor, isFetching } = useActor();
  return useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAvailableVehicles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceBooking[]>({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookingsByPlate(plate: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ServiceBooking[]>({
    queryKey: ["bookings", plate],
    queryFn: async () => {
      if (!actor || !plate) return [];
      return actor.getBookingsByNumberPlate(plate);
    },
    enabled: !!actor && !isFetching && !!plate,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      vehicleNumberPlate,
      customerName,
      phone,
      serviceType,
      preferredDate,
    }: {
      vehicleNumberPlate: string;
      customerName: string;
      phone: string;
      serviceType: string;
      preferredDate: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(
        vehicleNumberPlate,
        customerName,
        phone,
        serviceType,
        preferredDate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
    },
  });
}

export function useAddVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vehicle: Vehicle) => {
      if (!actor) throw new Error("Not connected");
      return actor.addVehicle(vehicle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useUpdateVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, vehicle }: { id: bigint; vehicle: Vehicle }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateVehicle(id, vehicle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useRemoveVehicle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeVehicle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: ServiceStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBookingStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBookings"] });
    },
  });
}
