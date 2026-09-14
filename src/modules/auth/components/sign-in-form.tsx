import { SignIn } from "@clerk/clerk-react";

export function SignInForm() {
  return (
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "w-full bg-card border border-border shadow-hard-md rounded-none p-6 sm:p-8",
          header: "text-left border-b border-border pb-3 mb-4 space-y-1",
          headerTitle: "font-mono font-bold text-lg uppercase tracking-wider text-foreground",
          headerSubtitle: "font-mono text-xs text-muted-foreground",
          socialButtonsBlockButton:
            "border border-border bg-muted/20 hover:bg-muted/60 text-foreground font-mono text-xs font-bold uppercase tracking-wider transition-all h-10 shadow-hard-sm rounded-none",
          socialButtonsBlockButtonText: "font-mono text-xs font-bold uppercase tracking-wider",
          dividerRow: "my-4",
          dividerLine: "bg-border",
          dividerText: "font-mono text-[10px] uppercase tracking-wider text-muted-foreground bg-card px-2",
          formFieldLabel: "font-mono text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5",
          formFieldInput:
            "rounded-none border border-border bg-background focus:border-foreground focus:ring-0 text-xs font-mono h-10 px-3 transition-colors shadow-none text-foreground",
          formButtonPrimary:
            "rounded-none bg-foreground text-background hover:bg-[#ece945] hover:text-black hover:border-black font-mono font-bold uppercase tracking-wider text-xs h-10 border border-foreground shadow-hard-sm transition-all cursor-pointer",
          footer: "pt-4 border-t border-border mt-4",
          footerActionText: "font-mono text-xs text-muted-foreground",
          footerActionLink: "font-mono text-xs text-foreground font-bold underline hover:text-[#ece945] transition-colors ml-1",
          identityPreviewText: "font-mono text-xs text-foreground font-medium",
          identityPreviewEditButton: "font-mono text-xs text-muted-foreground hover:text-foreground uppercase underline",
          alert: "rounded-none border border-destructive bg-destructive/10 text-destructive text-xs font-mono p-3",
          formFieldErrorText: "font-mono text-[11px] text-destructive mt-1",
        },
      }}
    />
  );
}
