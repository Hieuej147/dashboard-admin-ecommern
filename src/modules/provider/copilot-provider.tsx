import { useEffect, useState, useMemo, type ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";
import { CopilotKit } from "@copilotkit/react-core/v2";
import { dashboardCatalog } from "@/a2ui/catalog";
import { ENV } from "@/config/env";

export function CopilotAuthProvider({ children }: { children: ReactNode }) {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!isLoaded) return;

    if (isSignedIn) {
      getToken()
        .then((t) => {
          if (mounted) {
            setToken(t);
            setIsAuthReady(true);
          }
        })
        .catch((err) => {
          console.error("Failed to retrieve Clerk token for CopilotKit:", err);
          if (mounted) setIsAuthReady(true);
        });
    } else {
      setToken(null);
      setIsAuthReady(true);
    }
    return () => {
      mounted = false;
    };
  }, [getToken, isSignedIn, isLoaded]);

  // Periodic token refresh so JWT is always valid
  useEffect(() => {
    if (!isSignedIn || !isAuthReady) return;
    const interval = setInterval(() => {
      getToken()
        .then((t) => {
          if (t) {
            setToken((prev) => (prev === t ? prev : t));
          }
        })
        .catch(() => {});
    }, 50_000);
    return () => clearInterval(interval);
  }, [getToken, isSignedIn, isAuthReady]);

  // Stable headers for CopilotKit requests
  const headers = useMemo(() => {
    if (!token) return undefined;
    return {
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const runtimeUrl = `${ENV.API_BASE_URL}/api/copilotkit`;

  if (!isAuthReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2.5">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-xs text-slate-500 font-medium">Khởi tạo AI Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <CopilotKit
      runtimeUrl={runtimeUrl}
      agent="dashboard"
      a2ui={{ catalog: dashboardCatalog }}
      headers={headers}
      onError={(event) => {
        console.warn("[CopilotKit runtime warning]", event.error, event.context);
      }}
    >
      {children}
    </CopilotKit>
  );
}
