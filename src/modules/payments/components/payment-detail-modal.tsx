import React from "react";
import { usePayment } from "@/hooks/use-payments";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink, Hash, Clock, Copy, Check } from "lucide-react";

interface PaymentDetailModalProps {
  paymentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaymentDetailModal = React.memo(function PaymentDetailModal({
  paymentId,
  open,
  onOpenChange,
}: PaymentDetailModalProps) {
  const { data: payment, isLoading, isError } = usePayment(paymentId ?? "");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const formatVnd = (amountMinor: number = 0) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amountMinor);
  };

  const copyToClipboard = (text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 rounded-none border border-border bg-card font-mono shadow-hard-md overflow-hidden">
        {/* Modal Header */}
        <div className="border-b border-border bg-muted/40 p-4">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 border border-border bg-primary text-primary-foreground flex items-center justify-center font-bold">
                <CreditCard className="h-3.5 w-3.5" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
                  PAYMENT TRANSACTION DETAILS
                </DialogTitle>
                <DialogDescription className="text-[11px] text-muted-foreground mt-0.5">
                  Stripe gateway audit data and webhook event telemetry
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <div className="h-5 w-5 animate-spin border-2 border-foreground border-t-transparent" />
              <p className="text-xs">Loading transaction data...</p>
            </div>
          ) : isError || !payment ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              <p className="font-bold text-foreground">TRANSACTION RECORD NOT FOUND</p>
              <p className="mt-1 text-[11px]">
                No Stripe transaction record associated with reference #{paymentId}.
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {/* Amount & Status Box */}
              <div className="flex items-center justify-between p-3.5 border border-border bg-muted/20">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    TOTAL AMOUNT
                  </span>
                  <p className="text-2xl font-bold font-heading text-foreground mt-0.5">
                    {formatVnd(payment.amountMinor)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[11px] px-2.5 py-1 rounded-none uppercase font-bold tracking-wider ${
                    payment.status === "PAID"
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : payment.status === "FAILED"
                      ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {payment.status === "PAID"
                    ? "[ SETTLED ]"
                    : payment.status === "FAILED"
                    ? "[ FAILED ]"
                    : "[ PENDING ]"}
                </Badge>
              </div>

              {/* Transaction Key Details */}
              <div className="space-y-2 border border-border divide-y divide-border bg-card">
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    TRANSACTION ID
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-foreground text-[11px]">
                    <span className="truncate max-w-[220px]">{payment.id}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(payment.id, "tx-id")}
                      className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Copy transaction ID"
                    >
                      {copiedKey === "tx-id" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    ORDER ID
                  </span>
                  <span className="font-bold text-foreground text-[11px]">
                    #{payment.orderId}
                  </span>
                </div>

                {payment.providerSessionId && (
                  <div className="flex items-center justify-between p-2.5">
                    <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      STRIPE SESSION ID
                    </span>
                    <div className="flex items-center gap-1.5 text-foreground text-[11px]">
                      <span className="truncate max-w-[200px]" title={payment.providerSessionId}>
                        {payment.providerSessionId}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(payment.providerSessionId!, "sess-id")}
                        className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Copy Session ID"
                      >
                        {copiedKey === "sess-id" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                )}

                {payment.providerPaymentId && (
                  <div className="flex items-center justify-between p-2.5">
                    <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      STRIPE PAYMENT INTENT
                    </span>
                    <div className="flex items-center gap-1.5 text-foreground text-[11px]">
                      <span className="truncate max-w-[200px]" title={payment.providerPaymentId}>
                        {payment.providerPaymentId}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(payment.providerPaymentId!, "pi-id")}
                        className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Copy Payment Intent ID"
                      >
                        {copiedKey === "pi-id" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-2.5">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    CREATED AT
                  </span>
                  <span className="text-foreground text-[11px]">
                    {new Date(payment.createdAt).toLocaleString("en-US")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-border bg-muted/40 px-4 py-3 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            [ AUTOMATED STRIPE WEBHOOK AUDIT ]
          </span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

PaymentDetailModal.displayName = "PaymentDetailModal";
