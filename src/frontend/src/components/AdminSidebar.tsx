import { Button } from "@/components/ui/button";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  Bike,
  CalendarCheck,
  Car,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const sidebarLinks = [
  {
    to: "/admin/dashboard" as const,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  { to: "/admin/inventory" as const, label: "Inventory", icon: Car },
  { to: "/admin/bookings" as const, label: "Bookings", icon: CalendarCheck },
];

export default function AdminSidebar() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const router = useRouter();
  const { clear } = useInternetIdentity();

  const handleLogout = () => {
    clear();
    router.navigate({ to: "/admin" });
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Bike className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="font-serif font-bold text-sm text-sidebar-foreground block leading-none">
              Swamy Ayyappa
            </span>
            <span className="text-[9px] text-accent tracking-widest uppercase">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            data-ocid={`admin.${label.toLowerCase()}.link`}
            className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              pathname === to
                ? "bg-primary text-primary-foreground shadow-maroon"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
          data-ocid="admin.logout.button"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
