import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Bike, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AdminLoginPage() {
  const { login, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const router = useRouter();

  useEffect(() => {
    if (identity) {
      router.navigate({ to: "/admin/dashboard" });
    }
  }, [identity, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        <div className="mb-8">
          <div className="w-16 h-16 rounded-full bg-primary mx-auto flex items-center justify-center shadow-maroon mb-4">
            <Bike className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-1">Swamy Ayyappa Motors</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-8">
          <ShieldCheck className="w-10 h-10 text-accent mx-auto mb-4" />
          <h2 className="font-semibold text-foreground mb-2">Secure Login</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in with Internet Identity to access the admin dashboard.
          </p>

          <Button
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            className="w-full bg-primary hover:bg-maroon-light text-primary-foreground"
            data-ocid="admin.login.primary_button"
          >
            {(isLoggingIn || isInitializing) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isInitializing
              ? "Initializing..."
              : isLoggingIn
                ? "Signing in..."
                : "Sign In"}
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          <Link to="/" className="text-accent hover:underline">
            ← Back to Customer Portal
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
