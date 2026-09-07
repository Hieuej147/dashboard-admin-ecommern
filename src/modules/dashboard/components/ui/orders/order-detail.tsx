import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrderDto } from "@/hooks/query-key/query-key";
import { useCancelOrder } from "@/hooks/use-orders";
import { PaymentDetailModal } from "@/modules/payments";
import { formatVnd } from "@/lib/utils";
import {
  Ban,
  Calendar,
  CreditCard,
  ExternalLink,
  Mail,
  MapPin,
  Package,
  Phone,
  Receipt,
  Truck,
  User,
} from "lucide-react";

interface OrderDetailProps {
  order: OrderDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetail({ order, open, onOpenChange }: OrderDetailProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const cancelOrder = useCancelOrder();

  if (!order) return null;

  const totalItems = (order.items || []).reduce(
    (acc, item) => acc + (item.quantity || 0),
    0,
  );

  const canCancel =
    order.status !== "CANCELLED" &&
    order.status !== "DELIVERED" &&
    order.status !== "COMPLETED";

  const handleCancelOrder = async () => {
    try {
      await cancelOrder.mutateAsync(order.id);
      setConfirmCancel(false);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-5 sm:p-6 gap-5">
        {/* Header with Order ID & Status Badges */}
        <DialogHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between pr-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Package className="h-4 w-4" />
              </span>
              <DialogTitle className="font-mono text-lg font-semibold tracking-tight text-slate-900">
                #{order.id}
              </DialogTitle>
            </div>
            <DialogDescription className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Placed on {formatDate(order.createdAt)}
            </DialogDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge type="order" value={order.status} />
            <StatusBadge type="payment" value={order.paymentStatus} />
          </div>
        </DialogHeader>

        {/* Customer & Shipping Info (2 Columns) */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {/* Customer Card */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <User className="h-3.5 w-3.5 text-indigo-500" />
              Customer
            </div>
            <div className="mt-3 space-y-1.5">
              <p className="font-medium text-slate-900">
                {order.customerName || "Anonymous Customer"}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{order.customerEmail || "—"}</span>
              </p>
              <p className="pt-1 font-mono text-[11px] text-slate-400 truncate">
                ID: {order.userId}
              </p>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Truck className="h-3.5 w-3.5 text-emerald-600" />
              Shipping Address
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-slate-600">
              <p className="font-medium text-slate-900">
                {order.shippingAddress?.recipientName || order.customerName}
              </p>
              {order.shippingAddress?.phone && (
                <p className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                  {order.shippingAddress.phone}
                </p>
              )}
              <p className="flex items-start gap-1.5 text-slate-500 pt-0.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  {[
                    order.shippingAddress?.line1,
                    order.shippingAddress?.line2,
                    order.shippingAddress?.city,
                    order.shippingAddress?.province,
                    order.shippingAddress?.postalCode,
                    order.shippingAddress?.countryCode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "No address provided"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Receipt className="h-3.5 w-3.5 text-indigo-500" />
              Items ({totalItems})
            </h3>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <Table>
              <TableHeader className="bg-slate-50/80 text-[11px]">
                <TableRow>
                  <TableHead className="font-semibold text-slate-600">
                    Product
                  </TableHead>
                  <TableHead className="text-center font-semibold text-slate-600 w-16">
                    Qty
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">
                    Unit Price
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 text-xs">
                {order.items?.map((item) => (
                  <TableRow key={item.productId} className="hover:bg-slate-50/60">
                    <TableCell className="py-2.5">
                      <p className="font-medium text-slate-800">
                        {item.productName}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">
                        {item.productId}
                      </p>
                    </TableCell>
                    <TableCell className="text-center font-medium text-slate-700 py-2.5">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right text-slate-600 py-2.5">
                      {formatVnd(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-900 py-2.5">
                      {formatVnd(item.lineTotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Order Financial Summary Card */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/60">
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-indigo-500" />
              Payment Summary
            </span>
            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 transition cursor-pointer normal-case"
            >
              Gateway Log <ExternalLink className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-medium text-slate-700">
                {formatVnd(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping Fee</span>
              <span className="font-medium text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-sm font-semibold text-slate-900">
              <span className="text-xs uppercase tracking-wider text-slate-700">
                Total Amount
              </span>
              <span className="text-base text-indigo-600 font-bold">
                {formatVnd(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter showCloseButton className="justify-between items-center text-[11px] text-slate-400 gap-2">
          <div>
            Updated on {formatDate(order.updatedAt)}
          </div>

          {canCancel && (
            <div className="flex items-center gap-2">
              {confirmCancel ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-rose-600 font-medium">Cancel this order?</span>
                  <button
                    type="button"
                    disabled={cancelOrder.isPending}
                    onClick={handleCancelOrder}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
                  >
                    {cancelOrder.isPending ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                  <button
                    type="button"
                    disabled={cancelOrder.isPending}
                    onClick={() => setConfirmCancel(false)}
                    className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmCancel(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition cursor-pointer"
                >
                  <Ban className="h-3.5 w-3.5" />
                  Cancel Order
                </button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>

      <PaymentDetailModal
        paymentId={order.id}
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
      />
    </Dialog>
  );
}

/* ─── Helpers ─── */

function StatusBadge({
  type,
  value,
}: {
  type: "order" | "payment";
  value: string;
}) {
  const normalized = (value || "").toUpperCase();
  const isPaid = normalized.includes("PAID");
  const isFailed =
    normalized.includes("FAILED") || normalized.includes("CANCEL");

  const style = isPaid
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : isFailed
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <Badge variant="outline" className={`${style} text-[11px] px-2 py-0.5 capitalize`}>
      <span className="text-[10px] font-normal text-slate-400 mr-1 uppercase">
        {type}:
      </span>
      {value ? value.toLowerCase().replaceAll("_", " ") : "Unknown"}
    </Badge>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
