import { Outlet } from "@tanstack/react-router";
import CustomerNav from "../components/CustomerNav";
import Footer from "../components/Footer";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CustomerNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
