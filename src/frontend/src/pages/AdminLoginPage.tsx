import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Bike, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AdminLoginPage() {
  const { login, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { actor, isFetching: isActorFetching } = useActor();
  const router = useRouter();

  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminToken, setAdminToken] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState("");

  // After login + actor ready, check admin status
  useEffect(() => {
    if (!identity || !actor || isActorFetching) return;

    setCheckingAdmin(true);
    actor
      .isCallerAdmin()
      .then((result: boolean) => {
        setIsAdmin(result);
        if (result) {
          router.navigate({ to: "/admin/dashboard" });
        }
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setCheckingAdmin(false));
  }, [identity, actor, isActorFetching, router]);

  async function handleClaimAdmin() {
    if (!actor || !adminToken.trim()) return;
    setClaiming(true);
    setClaimError("");
    try {
      await (actor as any)._initializeAccessControlWithSecret(
        adminToken.trim(),
      );
      // Re-check admin status
      const result = await actor.isCallerAdmin();
      if (result) {
        router.navigate({ to: "/admin/dashboard" });
      } else {
        setClaimError("Invalid token. Please check and try again.");
      }
    } catch {
      setClaimError("Invalid token. Please check and try again.");
    } finally {
      setClaiming(false);
    }
  }

  const isLoading =
    isLoggingIn || isInitializing || checkingAdmin || isActorFetching;

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

        {!identity ? (
          // Step 1: Login
          <div className="bg-card rounded-lg border border-border p-8">
            <ShieldCheck className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="font-semibold text-foreground mb-2">Secure Login</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Sign in with Internet Identity to access the admin dashboard.
            </p>
            <Button
              onClick={login}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-maroon-light text-primary-foreground"
              data-ocid="admin.login.primary_button"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isInitializing
                ? "Initializing..."
                : isLoggingIn
                  ? "Signing in..."
                  : "Sign In"}
            </Button>
          </div>
        ) : checkingAdmin || isActorFetching ? (
          // Loading admin check
          <div className="bg-card rounded-lg border border-border p-8">
            <Loader2 className="w-10 h-10 text-accent mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground text-sm">
              Verifying admin access...
            </p>
          </div>
        ) : isAdmin === false ? (
          // Step 2: Claim admin with token
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg border border-border p-8"
          >
            <KeyRound className="w-10 h-10 text-accent mx-auto mb-4" />
            <h2 className="font-semibold text-foreground mb-2">
              Claim Admin Access
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              You are logged in but not yet an admin. Enter your admin token to
              claim access.
            </p>
            <div className="text-left mb-4">
              <Label
                htmlFor="admin-token"
                className="text-sm text-foreground mb-1 block"
              >
                Admin Token
              </Label>
              <Input
                id="admin-token"
                type="password"
                placeholder="Enter admin token"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleClaimAdmin()}
                className="bg-background border-border"
                data-ocid="admin.token.input"
              />
            </div>
            {claimError && (
              <p
                className="text-destructive text-sm mb-4"
                data-ocid="admin.token.error_state"
              >
                {claimError}
              </p>
            )}
            <Button
              onClick={handleClaimAdmin}
              disabled={claiming || !adminToken.trim()}
              className="w-full bg-primary hover:bg-maroon-light text-primary-foreground"
              data-ocid="admin.claim.primary_button"
            >
              {claiming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {claiming ? "Claiming..." : "Claim Admin Access"}
            </Button>
          </motion.div>
        ) : null}

        <p className="mt-6 text-xs text-muted-foreground">
          <Link to="/" className="text-accent hover:underline">
            ← Back to Customer Portal
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
