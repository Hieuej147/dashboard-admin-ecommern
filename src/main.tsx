import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@copilotkit/react-core/v2/styles.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ReactQueryProviders } from "./modules/provider/provider.tsx";
import { CopilotAuthProvider } from "./modules/provider/copilot-provider.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <BrowserRouter>
        <ReactQueryProviders>
          <CopilotAuthProvider>
            <App />
          </CopilotAuthProvider>
        </ReactQueryProviders>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
);
