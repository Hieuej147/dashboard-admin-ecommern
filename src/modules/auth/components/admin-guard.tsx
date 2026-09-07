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
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
        <p className="text-xs text-slate-500 font-medium">Verifying administrator session...</p>
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
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
        <p className="text-xs text-slate-500 font-medium">Checking administrator privileges...</p>
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
