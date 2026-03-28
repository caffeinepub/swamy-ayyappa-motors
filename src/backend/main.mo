import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Vehicle data types and seed vehicles
  type VehicleCategory = { #new; #used };

  type Vehicle = {
    name : Text;
    model : Text;
    year : Nat;
    price : Nat;
    category : VehicleCategory;
    description : Text;
    available : Bool;
  };

  module Vehicle {
    public func compare(vehicle1 : Vehicle, vehicle2 : Vehicle) : Order.Order {
      Text.compare(vehicle1.name, vehicle2.name);
    };
  };

  let vehicles = Map.empty<Nat, Vehicle>();
  var nextVehicleId = 1;

  func seedVehicles() {
    let seedData = [
      (
        "Hero Splendor+",
        "Splendor+ XTec",
        2023,
        75000,
        #new,
        "Hero Splendor+ XTec with Smart Technology",
      ),
      (
        "Honda Activa 6G",
        "Activa 6G DLX",
        2023,
        85000,
        #new,
        "Latest Honda Activa 6G model with digital meter",
      ),
      (
        "TVS Apache RTR",
        "Apache RTR 160",
        2022,
        105000,
        #used,
        "TVS Apache RTR 160, single owner, well maintained",
      ),
      (
        "Bajaj Pulsar 150",
        "Pulsar 150 Neon",
        2021,
        90000,
        #used,
        "Bajaj Pulsar 150 Neon edition, lightly used",
      ),
      (
        "Royal Enfield Bullet",
        "Bullet 350",
        2023,
        180000,
        #new,
        "Brand new Royal Enfield Bullet 350 classic model",
      ),
    ];

    for ((name, model, year, price, category, desc) in seedData.values()) {
      let vehicleId = nextVehicleId;
      let vehicle : Vehicle = {
        name;
        model;
        year;
        price;
        category;
        description = desc;
        available = true;
      };
      vehicles.add(vehicleId, vehicle);
      nextVehicleId += 1;
    };
  };

  // Initialize seed vehicles
  seedVehicles();

  // Service booking types
  type ServiceStatus = { #pending; #inProgress; #completed };

  type ServiceBooking = {
    id : Nat;
    vehicleNumberPlate : Text;
    customerName : Text;
    phone : Text;
    serviceType : Text;
    preferredDate : Text;
    status : ServiceStatus;
    creationTimestamp : Time.Time;
  };

  module ServiceBooking {
    public func compare(booking1 : ServiceBooking, booking2 : ServiceBooking) : Order.Order {
      Nat.compare(booking1.id, booking2.id);
    };
  };

  let serviceBookings = Map.empty<Nat, ServiceBooking>();
  var nextBookingId = 1;

  // Prefabricated RBAC system
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  // Vehicle management functions
  public query ({ caller }) func listAvailableVehicles() : async [Vehicle] {
    vehicles.values().filter(func(v) { v.available }).toArray().sort();
  };

  public shared ({ caller }) func addVehicle(vehicle : Vehicle) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let vehicleId = nextVehicleId;
    vehicles.add(vehicleId, vehicle);
    nextVehicleId += 1;
    vehicleId;
  };

  public shared ({ caller }) func updateVehicle(id : Nat, vehicle : Vehicle) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    if (not vehicles.containsKey(id)) {
      Runtime.trap("Vehicle with the given id does not exist. ");
    };
    vehicles.add(id, vehicle);
  };

  public shared ({ caller }) func removeVehicle(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    vehicles.remove(id);
  };

  // Service booking functions
  public shared ({ caller }) func createBooking(vehicleNumberPlate : Text, customerName : Text, phone : Text, serviceType : Text, preferredDate : Text) : async Nat {
    let booking : ServiceBooking = {
      id = nextBookingId;
      vehicleNumberPlate;
      customerName;
      phone;
      serviceType;
      preferredDate;
      status = #pending;
      creationTimestamp = Time.now();
    };
    let bookingId = nextBookingId;
    serviceBookings.add(bookingId, booking);
    nextBookingId += 1;
    bookingId;
  };

  public query ({ caller }) func getBookingsByNumberPlate(vehicleNumberPlate : Text) : async [ServiceBooking] {
    serviceBookings.values().filter(func(b) { b.vehicleNumberPlate == vehicleNumberPlate }).toArray().sort();
  };

  public query ({ caller }) func getAllBookings() : async [ServiceBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    serviceBookings.values().toArray().sort();
  };

  public shared ({ caller }) func updateBookingStatus(id : Nat, newStatus : ServiceStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    switch (serviceBookings.get(id)) {
      case (null) { Runtime.trap("Booking does not exist. ") };
      case (?booking) {
        let updatedBooking = { booking with status = newStatus };
        serviceBookings.add(id, updatedBooking);
      };
    };
  };
};
