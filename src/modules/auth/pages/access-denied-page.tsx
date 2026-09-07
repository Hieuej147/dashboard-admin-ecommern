import { useClerk, useUser } from "@clerk/clerk-react";
import { ShieldAlert, LogOut, ShoppingBag, RefreshCw } from "lucide-react";

export default function AccessDeniedPage() {
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleSignOut = () => {
    void signOut({ redirectUrl: "/sign-in" });
  };

  const storeUrl =
    (import.meta as unknown as { env: Record<string, string> }).env
      .VITE_STOREFRONT_URL || "http://localhost:3001";

  const email =
    user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "Unknown email";
  const displayName = user?.fullName || user?.username || email;
  const role = (user?.publicMetadata?.role as string) || "customer";

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        {/* Top visual warning banner */}
        <div className="bg-red-50 border-b border-red-100 p-6 sm:p-8 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4 shadow-inner">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-100/70 px-3 py-1 rounded-full mb-2">
            Error 403 · Access Denied
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Administrator Access Required
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-sm">
            You are signed in, but this portal is strictly restricted to administrator accounts.
          </p>
        </div>

        {/* Current user identity preview */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-3.5">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={displayName}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-slate-200 flex items-center justify-center font-medium text-slate-700">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {displayName}
              </p>
              <p className="text-xs text-slate-500 truncate">{email}</p>
            </div>
            <span className="shrink-0 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
              {role}
            </span>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition shadow-sm cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign in with another account
            </button>

            <a
              href={storeUrl}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <ShoppingBag className="h-4 w-4" />
              Return to Customer Store
            </a>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reload after updating role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
