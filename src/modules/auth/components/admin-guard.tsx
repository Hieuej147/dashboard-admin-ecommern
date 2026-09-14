import React from "react";
import { useAuth, useUser, RedirectToSignIn } from "@clerk/clerk-react";
import { useCurrentUser } from "@/hooks/use-customers";
import AccessDeniedPage from "../pages/access-denied-page";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { data: currentUser, isPending: isBackendPending } = useCurrentUser();

  // 1. Session is still loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background tactical-grid gap-4 font-mono p-4">
        <div className="border border-border bg-card p-6 shadow-hard-md max-w-sm w-full text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#ece945] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              [ VERIFYING SESSION ]
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Authenticating operator credentials against Fleet Identity Gateway...
          </p>
          <div className="h-1 w-full bg-muted overflow-hidden">
            <div className="h-full bg-[#ece945] w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // 2. User is not signed in
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // 3. Fast-path: Check Clerk public metadata
  const isClerkAdmin = user?.publicMetadata?.role === "admin";
  if (isClerkAdmin) {
    return <>{children}</>;
  }

  // 4. If Clerk publicMetadata doesn't say admin yet, check Backend database via /v1/me
  if (isBackendPending) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background tactical-grid gap-4 font-mono p-4">
        <div className="border border-border bg-card p-6 shadow-hard-md max-w-sm w-full text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#ece945] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              [ CHECKING CLEARANCE ]
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Polling database permissions for role assignment...
          </p>
          <div className="h-1 w-full bg-muted overflow-hidden">
            <div className="h-full bg-foreground w-3/4 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const isBackendAdmin = currentUser?.role === "admin";
  if (isBackendAdmin) {
    return <>{children}</>;
  }

  // 5. User is authenticated, but does NOT have admin role
  return <AccessDeniedPage />;
}
