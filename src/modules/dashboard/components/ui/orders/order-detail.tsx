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
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto font-mono p-5 sm:p-6 gap-5 border-2 border-border bg-card shadow-hard-md select-none">
        {/* Header with Order ID & Status Badges */}
        <DialogHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-border pb-3 pr-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#ece945] uppercase">
              <span>ORDER DOSSIER</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-7 w-7 items-center justify-center border border-border bg-muted/30 text-foreground">
                <Package className="h-4 w-4" />
              </span>
              <DialogTitle className="font-mono text-base font-bold tracking-tight text-foreground uppercase">
                #{order.id}
              </DialogTitle>
            </div>
            <DialogDescription className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Created: {formatDate(order.createdAt)}
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
          <div className="border border-border bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <User className="h-3.5 w-3.5 text-foreground" />
              CUSTOMER
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <p className="font-bold text-foreground">
                {order.customerName || "Guest"}
              </p>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">{order.customerEmail || "—"}</span>
              </p>
              <p className="pt-1 text-[10px] text-muted-foreground truncate select-all">
                USER ID: {order.userId}
              </p>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="border border-border bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Truck className="h-3.5 w-3.5 text-foreground" />
              SHIPPING DESTINATION
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <p className="font-bold text-foreground">
                {order.shippingAddress?.recipientName || order.customerName}
              </p>
              {order.shippingAddress?.phone && (
                <p className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="h-3 w-3 shrink-0" />
                  {order.shippingAddress.phone}
                </p>
              )}
              <p className="flex items-start gap-1.5 text-muted-foreground pt-0.5">
                <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
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
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
              <Receipt className="h-3.5 w-3.5 text-[#ece945]" />
              ITEM MANIFEST ({totalItems} ITEMS)
            </h3>
          </div>

          <div className="border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40 border-b border-border text-[11px] font-bold uppercase tracking-wider">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-foreground font-bold">ITEM</TableHead>
                  <TableHead className="text-center text-foreground font-bold w-16">QTY</TableHead>
                  <TableHead className="text-right text-foreground font-bold">UNIT PRICE</TableHead>
                  <TableHead className="text-right text-foreground font-bold">AMOUNT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {order.items?.map((item) => (
                  <TableRow key={item.productId} className="border-b border-border/70 hover:bg-muted/20">
                    <TableCell className="py-2.5">
                      <p className="font-bold text-foreground">
                        {item.productName}
                      </p>
                      <p className="text-[10px] text-muted-foreground select-all">
                        ID: {item.productId}
                      </p>
                    </TableCell>
                    <TableCell className="text-center font-bold text-foreground py-2.5">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground py-2.5">
                      {formatVnd(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-foreground py-2.5">
                      {formatVnd(item.lineTotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Order Financial Summary Card */}
        <div className="border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between pb-2 text-xs font-bold uppercase tracking-wider text-foreground border-b border-border">
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-[#ece945]" />
              SETTLEMENT SUMMARY
            </span>
            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-foreground underline hover:text-foreground/70 transition-colors cursor-pointer"
            >
              TRANSACTION LEDGER <ExternalLink className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Item Subtotal</span>
              <span className="font-bold text-foreground">
                {formatVnd(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping Fee</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Free</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-border text-sm font-bold text-foreground">
              <span className="text-xs uppercase tracking-wider">
                TOTAL SETTLEMENT
              </span>
              <span className="text-base text-foreground font-bold">
                {formatVnd(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="justify-between items-center text-[11px] text-muted-foreground gap-2 pt-2 border-t border-border">
          <div>
            Updated {formatDate(order.updatedAt)}
          </div>

          {canCancel && (
            <div className="flex items-center gap-2">
              {confirmCancel ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-rose-600 font-bold">Cancel this order?</span>
                  <button
                    type="button"
                    disabled={cancelOrder.isPending}
                    onClick={handleCancelOrder}
                    className="px-2.5 py-1 text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
                  >
                    {cancelOrder.isPending ? "Canceling..." : "Confirm Cancel"}
                  </button>
                  <button
                    type="button"
                    disabled={cancelOrder.isPending}
                    onClick={() => setConfirmCancel(false)}
                    className="px-2 py-1 text-xs text-foreground border border-border hover:bg-muted transition cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmCancel(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border border-rose-300 dark:border-rose-900/50 transition cursor-pointer"
                >
                  <Ban className="h-3.5 w-3.5" />
                  CANCEL ORDER
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
  const isPaid = normalized.includes("PAID") || normalized.includes("COMPLETED");
  const isFailed =
    normalized.includes("FAILED") || normalized.includes("CANCEL");

  const style = isPaid
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    : isFailed
      ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
      : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400";

  const label = type === "order" ? "ORDER" : "PAYMENT";

  return (
    <Badge variant="outline" className={`${style} rounded-none text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider`}>
      <span className="text-muted-foreground mr-1">[{label}]</span>
      {value ? value.replaceAll("_", " ") : "UNKNOWN"}
    </Badge>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
