import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import AdminLayout from "./layouts/AdminLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminInventoryPage from "./pages/AdminInventoryPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import BookServicePage from "./pages/BookServicePage";
import HomePage from "./pages/HomePage";
import TrackServicePage from "./pages/TrackServicePage";
import VehiclesPage from "./pages/VehiclesPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
  notFoundComponent: () => <Navigate to="/" />,
});

const customerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "customer-layout",
  component: CustomerLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/",
  component: HomePage,
});

const vehiclesRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/vehicles",
  component: VehiclesPage,
});

const bookServiceRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/book-service",
  component: BookServicePage,
});

const trackRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/track",
  component: TrackServicePage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLoginPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-layout",
  component: AdminLayout,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/dashboard",
  component: AdminDashboardPage,
});

const adminInventoryRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/inventory",
  component: AdminInventoryPage,
});

const adminBookingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/bookings",
  component: AdminBookingsPage,
});

const routeTree = rootRoute.addChildren([
  customerLayoutRoute.addChildren([
    homeRoute,
    vehiclesRoute,
    bookServiceRoute,
    trackRoute,
  ]),
  adminLoginRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminInventoryRoute,
    adminBookingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Re-export Navigate for use in other files
export { Navigate, useNavigate };

export default function App() {
  return <RouterProvider router={router} />;
}
