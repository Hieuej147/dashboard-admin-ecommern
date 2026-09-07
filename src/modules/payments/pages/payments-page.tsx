import { useState } from "react";
import { CreditCard, ArrowUpRight, Search } from "lucide-react";
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <CreditCard className="h-4 w-4" />
            </div>
            Payments & Transactions
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Monitor Stripe gateway performance, verify settled revenue, and inspect transaction logs.
          </p>
        </div>
      </div>

      {/* Metrics Cards from GET /payments/admin/metrics */}
      <PaymentsMetricsCards />

      {/* Transactions List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Payment Statuses</option>
              <option value="PAID">Paid / Completed</option>
              <option value="PENDING">Pending / Processing</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Order / Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Gateway Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isPending ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No transactions found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const status = (order.paymentStatus || "").toUpperCase();
                  const isPaid = status === "PAID";
                  const isFailed = status.includes("FAIL");

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5 font-mono text-slate-900 font-medium">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-900 truncate max-w-[180px]">
                          {order.customerName || "Customer"}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {order.customerEmail}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900">
                        {formatVnd(order.total)}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-semibold ${
                            isPaid
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : isFailed
                              ? "border-rose-200 bg-rose-50 text-rose-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }`}
                        >
                          {status || "UNKNOWN"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenPayment(order.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                        >
                          Details <ArrowUpRight className="h-3 w-3" />
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
