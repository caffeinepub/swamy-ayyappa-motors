import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ServiceBooking {
    id: bigint;
    vehicleNumberPlate: string;
    customerName: string;
    status: ServiceStatus;
    serviceType: string;
    creationTimestamp: Time;
    preferredDate: string;
    phone: string;
}
export type Time = bigint;
export interface Vehicle {
    model: string;
    name: string;
    year: bigint;
    description: string;
    available: boolean;
    category: VehicleCategory;
    price: bigint;
}
export enum ServiceStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VehicleCategory {
    new_ = "new",
    used = "used"
}
export interface backendInterface {
    addVehicle(vehicle: Vehicle): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBooking(vehicleNumberPlate: string, customerName: string, phone: string, serviceType: string, preferredDate: string): Promise<bigint>;
    getAllBookings(): Promise<Array<ServiceBooking>>;
    getBookingsByNumberPlate(vehicleNumberPlate: string): Promise<Array<ServiceBooking>>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    listAvailableVehicles(): Promise<Array<Vehicle>>;
    removeVehicle(id: bigint): Promise<void>;
    updateBookingStatus(id: bigint, newStatus: ServiceStatus): Promise<void>;
    updateVehicle(id: bigint, vehicle: Vehicle): Promise<void>;
}
