import { Route, Routes } from "react-router-dom";
import { HomePage } from "@/modules/overview";
import { ProductsPage } from "@/modules/products";
import { OrdersPage } from "@/modules/orders";
import { CustomersPage } from "@/modules/customers";
import { PaymentsPage } from "@/modules/payments";
import { NotificationsPage } from "@/modules/notifications";
import { SettingsPage } from "@/modules/settings";
import { AiWorkspacePage } from "@/modules/ai-workspace";
import DashboardLayout from "@/modules/dashboard/components/layouts/dashboard-layout";
import { SignInPage, SignUpPage, AdminGuard, AccessDeniedPage } from "./modules/auth";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <Routes>
        {/* Auth Routes */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/*"
          element={
            <AdminGuard>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/ai-workspace" element={<AiWorkspacePage />} />
                </Routes>
              </DashboardLayout>
            </AdminGuard>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="border rounded-sm border-red-500 text-yellow-500 bg-red-500 px-4 py-2">
                Not found 404
              </h1>
            </div>
          }
        />
      </Routes>
    </TooltipProvider>
  );
}

export default App;
