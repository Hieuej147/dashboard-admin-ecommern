import { useState } from "react";
import { CreditCard, ArrowUpRight, Search, CheckCircle2 } from "lucide-react";
import { PaymentsMetricsCards } from "../components/payments-metrics-cards";
import { PaymentDetailModal } from "../components/payment-detail-modal";
import { useAdminOrders } from "@/hooks/use-orders";
import { Badge } from "@/components/ui/badge";
import { formatVnd } from "@/lib/utils";

export default function PaymentsPage() {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("");

  const { orders, isPending } = useAdminOrders({
    search: search || undefined,
    paymentStatus: paymentStatusFilter || undefined,
  });

  const handleOpenPayment = (orderId: string) => {
    // Note: in this microservice, each order creates a corresponding payment record
    setSelectedPaymentId(orderId);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 bg-[#ece945]" />
            <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-wider uppercase text-foreground">
              PAYMENT & TRANSACTION MANAGEMENT
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Track Stripe gateway health, settlement volume, and transaction audit trails.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shadow-hard-sm">
            <CheckCircle2 className="h-3.5 w-3.5" />
            [ STRIPE GATEWAY: OPERATIONAL ]
          </span>
        </div>
      </div>

      {/* Metrics Cards from GET /payments/admin/metrics */}
      <PaymentsMetricsCards />

      {/* Transactions List */}
      <div className="border border-border bg-card shadow-hard-sm">
        {/* Table Title Bar */}
        <div className="border-b border-border bg-muted/40 px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <CreditCard className="h-3.5 w-3.5 text-foreground" />
            ONLINE TRANSACTION LEDGER
          </span>
          <span className="text-[10px] text-muted-foreground uppercase">
            [ TOTAL RECORDS: {orders.length} ]
          </span>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-b border-border bg-card">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order ID or customer name/email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-border bg-background focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-border bg-background text-foreground focus:outline-none focus:border-foreground uppercase font-bold cursor-pointer"
            >
              <option value="">ALL STATUSES</option>
              <option value="PAID">SETTLED (PAID)</option>
              <option value="PENDING">PROCESSING (PENDING)</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/60 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5">ORDER REFERENCE</th>
                <th className="px-4 py-2.5">CUSTOMER</th>
                <th className="px-4 py-2.5">AMOUNT</th>
                <th className="px-4 py-2.5">GATEWAY STATUS</th>
                <th className="px-4 py-2.5">CREATED AT</th>
                <th className="px-4 py-2.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isPending ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin border-2 border-foreground border-t-transparent" />
                      Loading transaction ledger...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    [ NO TRANSACTIONS MATCH SELECTED FILTER ]
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const status = (order.paymentStatus || "").toUpperCase();
                  const isPaid = status === "PAID";
                  const isFailed = status.includes("FAIL");

                  return (
                    <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-bold text-foreground">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-foreground truncate max-w-[200px]">
                          {order.customerName || "Guest"}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                          {order.customerEmail}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-foreground">
                        {formatVnd(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-2 py-0.5 rounded-none uppercase font-bold tracking-wider ${
                            isPaid
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : isFailed
                              ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {isPaid ? "[ SETTLED ]" : isFailed ? "[ FAILED ]" : "[ PROCESSING ]"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenPayment(order.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold border border-border bg-card px-2.5 py-1 text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          DETAILS <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Detail Modal (uses GET /payments/{id}) */}
      <PaymentDetailModal
        paymentId={selectedPaymentId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
