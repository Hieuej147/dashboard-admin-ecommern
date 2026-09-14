import React, { useState, useEffect } from "react";
import { ArrowUpRight, ShieldCheck, Terminal, Radio } from "lucide-react";

type AuthLayoutProps = {
  children: React.ReactNode;
  mode?: "sign-in" | "sign-up";
};

export function AuthLayout({ children, mode = "sign-in" }: AuthLayoutProps) {
  const [utcTime, setUtcTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const iso = now.toISOString().replace("T", " ").substring(0, 19);
      setUtcTime(`${iso} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const storeUrl =
    (import.meta as unknown as { env: Record<string, string> }).env
      .VITE_STOREFRONT_URL || "http://localhost:3001";

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-[#ece945] selection:text-black">
      {/* =====================================================================
          Left column - Field Operations Console (Desktop only)
          ===================================================================== */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0d0f11] text-white p-12 relative overflow-hidden border-r border-border/40">
        {/* Tactical Background Grid Overlay */}
        <div className="absolute inset-0 tactical-grid opacity-30 pointer-events-none" />

        {/* Ambient Corner Crosshairs */}
        <span className="absolute top-4 left-4 font-mono text-[10px] text-white/20 select-none">
          + LAT 10.7626° N
        </span>
        <span className="absolute top-4 right-4 font-mono text-[10px] text-white/20 select-none">
          + LON 106.6601° E
        </span>
        <span className="absolute bottom-4 left-4 font-mono text-[10px] text-white/20 select-none">
          + ENC: TLS_1.3
        </span>
        <span className="absolute bottom-4 right-4 font-mono text-[10px] text-white/20 select-none">
          + SEC_L4_VERIFIED
        </span>

        {/* 1. Header Branding Strip */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#ece945] text-black font-mono font-black text-xl flex items-center justify-center border border-black shadow-hard-sm">
              HQ
            </div>
            <div>
              <div className="font-mono text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                COMMERCE FLEET HQ
                <span className="text-[9px] px-1.5 py-0.5 bg-white/10 text-[#ece945] font-mono border border-white/20">
                  v4.2
                </span>
              </div>
              <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                [ ADMINISTRATIVE COMMAND CENTER ]
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Narrative & Telemetry Panel */}
        <div className="relative z-10 max-w-lg space-y-6">
          {/* Directive Badge */}
          <div className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#ece945]">
            <span className="w-2 h-2 bg-[#ece945] animate-pulse inline-block" />
            OPERATOR CLEARANCE REQUIRED
          </div>

          {/* Core Title */}
          <div className="space-y-2">
            <h1 className="font-sans font-black text-4xl tracking-tight uppercase leading-[1.05] text-white">
              FLEET DISPATCH & CONTROL CENTER
            </h1>
            <p className="font-sans text-neutral-400 text-sm leading-relaxed">
              Restricted management environment for distributed inventory sync, multi-service order lifecycle processing, and real-time operational telemetry.
            </p>
          </div>

          {/* Tactical Live HUD Matrix */}
          <div className="border border-white/15 bg-black/60 p-4 font-mono text-xs space-y-3 backdrop-blur-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[10px] text-neutral-400 uppercase">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Terminal className="h-3.5 w-3.5 text-[#ece945]" />
                TELEMETRY_STATUS
              </span>
              <span className="text-[#ece945]">ONLINE</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-neutral-500 block text-[9px] uppercase">CLUSTER REGION</span>
                <span className="text-neutral-200 font-bold">AP-SOUTHEAST-1</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px] uppercase">SERVICES STATUS</span>
                <span className="text-neutral-200 font-bold">6/6 NOMINAL</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px] uppercase">CIPHER SUITE</span>
                <span className="text-neutral-200 font-bold">AES-256-GCM / TLS 1.3</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[9px] uppercase">AUTHENTICATION</span>
                <span className="text-neutral-200 font-bold">PKCE / ED25519</span>
              </div>
            </div>

            {/* Live Clock Strip */}
            <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[10px]">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Radio className="h-3 w-3 text-[#ece945] animate-pulse" />
                SYSTEM UTC:
              </span>
              <span className="text-neutral-200 font-bold tracking-wider">
                {utcTime || "SYNCHRONIZING..."}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Footer Regulatory Metadata */}
        <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-neutral-400 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#ece945]" />
            <span>ISO/IEC 27001 AUDIT REGIME</span>
          </div>
          <span>© 2026 E-COMMERCE CORE DIRECTIVE</span>
        </div>
      </div>

      {/* =====================================================================
          Right column - Operator Authentication Terminal
          ===================================================================== */}
      <div className="flex flex-col justify-between w-full lg:w-1/2 p-6 sm:p-12 bg-background tactical-grid relative min-h-screen">
        {/* Top Operational Navigation Strip */}
        <div className="w-full flex items-center justify-between">
          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center gap-2.5">
            <div className="w-7 h-7 bg-[#ece945] text-black font-mono font-black text-sm flex items-center justify-center border border-black shadow-hard-sm">
              HQ
            </div>
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-foreground">
              ADMIN CONSOLE
            </span>
          </div>

          {/* Desktop Terminal Readout */}
          <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase">
            <span className="w-1.5 h-1.5 bg-[#ece945] inline-block animate-pulse" />
            <span>[ TERMINAL_NODE: SGN-AUTH-01 ]</span>
          </div>

          {/* Return to Civilian Storefront Link */}
          <a
            href={storeUrl}
            className="inline-flex items-center gap-1.5 border border-border bg-card hover:bg-muted px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground shadow-hard-sm transition-all cursor-pointer hover:border-foreground"
          >
            <span>STOREFRONT</span>
            <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
          </a>
        </div>

        {/* Central Terminal Form Area */}
        <div className="w-full max-w-md mx-auto my-8 relative">
          {/* Tactical Corner Crosshairs around the card */}
          <div className="absolute -top-3 -left-3 font-mono text-[11px] text-foreground/30 select-none pointer-events-none">
            +
          </div>
          <div className="absolute -top-3 -right-3 font-mono text-[11px] text-foreground/30 select-none pointer-events-none">
            +
          </div>
          <div className="absolute -bottom-3 -left-3 font-mono text-[11px] text-foreground/30 select-none pointer-events-none">
            +
          </div>
          <div className="absolute -bottom-3 -right-3 font-mono text-[11px] text-foreground/30 select-none pointer-events-none">
            +
          </div>

          {/* Status Header Strip */}
          <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/40 border border-border px-3 py-1.5">
            <span className="font-bold text-foreground">
              {mode === "sign-in" ? "[ AUTH_MODE: OPERATOR_SIGN_IN ]" : "[ AUTH_MODE: OPERATOR_REGISTRATION ]"}
            </span>
            <span className="text-[#ece945] font-bold">PORT 443 SECURE</span>
          </div>

          {/* Embedded Form Component */}
          <div className="w-full">
            {children}
          </div>
        </div>

        {/* Bottom Security Notice Strip */}
        <div className="w-full max-w-md mx-auto text-center font-mono text-[9px] text-muted-foreground uppercase tracking-wider space-y-1">
          <p>
            [ NOTICE: ALL ACCESS ATTEMPTS ARE GEOLOCATED & RECORDED IN IMMUTABLE AUDIT TRAIL ]
          </p>
          <p className="text-foreground/40">
            SYSTEM DIRECTIVE // UNAUTHORIZED ENTRY IS SUBJECT TO AUTOMATIC REVOCATION
          </p>
        </div>
      </div>
    </div>
  );
}
