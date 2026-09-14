import { useClerk, useUser } from "@clerk/clerk-react";
import { ShieldAlert, LogOut, ShoppingBag, RefreshCw, Lock } from "lucide-react";

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
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "UNIDENTIFIED_PRINCIPAL";
  const displayName = user?.fullName || user?.username || email;
  const role = ((user?.publicMetadata?.role as string) || "customer").toUpperCase();

  return (
    <div className="min-h-screen w-full bg-background tactical-grid flex items-center justify-center p-4 sm:p-6 text-foreground selection:bg-[#ece945] selection:text-black">
      <div className="w-full max-w-lg bg-card border border-destructive/80 shadow-hard-md relative overflow-hidden">
        {/* Top Warning Banner */}
        <div className="bg-destructive text-destructive-foreground p-4 sm:p-5 flex items-center gap-3 border-b border-destructive">
          <div className="p-2 bg-black/20 border border-white/20">
            <ShieldAlert className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/80">
              [ VIOLATION: HTTP_403_FORBIDDEN ]
            </div>
            <h1 className="font-mono font-black text-base sm:text-lg uppercase tracking-wider text-white">
              INSUFFICIENT OPERATOR PRIVILEGE
            </h1>
          </div>
        </div>

        {/* Status Strip */}
        <div className="bg-muted/40 border-b border-border px-4 py-2 flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-destructive" />
            SECURITY_LEVEL: 04 REQUIRED
          </span>
          <span className="text-destructive font-bold">ACCESS REJECTED</span>
        </div>

        {/* Identity Dossier */}
        <div className="p-6 space-y-6">
          <p className="text-xs font-sans text-muted-foreground leading-relaxed">
            Your authenticated session has been verified, but your assigned role does not grant administrative clearance to this operations console.
          </p>

          {/* User Record Table */}
          <div className="border border-border bg-muted/20 divide-y divide-border font-mono text-xs">
            <div className="p-3 flex items-center gap-3">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={displayName}
                  className="h-10 w-10 border border-border object-cover shrink-0"
                />
              ) : (
                <div className="h-10 w-10 border border-border bg-foreground text-background font-mono font-bold flex items-center justify-center shrink-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-muted-foreground uppercase">AUTHENTICATED OPERATOR</div>
                <div className="font-bold text-foreground truncate">{displayName}</div>
                <div className="text-[11px] text-muted-foreground truncate">{email}</div>
              </div>
            </div>

            <div className="p-3 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground uppercase">ASSIGNED ROLE</span>
              <span className="bg-destructive/15 border border-destructive/40 text-destructive font-mono font-bold text-[10px] px-2 py-0.5 uppercase tracking-wider">
                {role}
              </span>
            </div>

            <div className="p-3 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground uppercase">TARGET ENCLAVE</span>
              <span className="font-mono text-foreground text-[11px]">
                COMMERCE_FLEET_HQ
              </span>
            </div>
          </div>

          {/* Action Directives */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full h-10 inline-flex items-center justify-center gap-2 border border-foreground bg-foreground text-background hover:bg-[#ece945] hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-hard-sm cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              [ SIGN IN WITH AUTHORIZED ACCOUNT ]
            </button>

            <a
              href={storeUrl}
              className="w-full h-10 inline-flex items-center justify-center gap-2 border border-border bg-card hover:bg-muted text-foreground font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-hard-sm cursor-pointer"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              [ RETURN TO CIVILIAN STOREFRONT ]
            </a>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-2 inline-flex items-center justify-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              RE-POLL OPERATOR PRIVILEGES
            </button>
          </div>
        </div>

        {/* Footer Security Notice */}
        <div className="border-t border-border bg-muted/30 px-4 py-2 font-mono text-[9px] text-center text-muted-foreground uppercase tracking-widest">
          SECURITY PROTOCOL ENFORCED // ALL REJECTIONS AUDITED
        </div>
      </div>
    </div>
  );
}
