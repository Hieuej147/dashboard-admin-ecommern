import React from "react";
import { usePayment } from "@/hooks/use-payments";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink, Hash, Clock, Copy } from "lucide-react";

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

  const formatVnd = (amountMinor: number = 0) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amountMinor);
  };

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900">
                Payment Transaction Details
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Stripe gateway record and webhook reconciliation
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="text-xs text-slate-500">Loading payment data...</p>
          </div>
        ) : isError || !payment ? (
          <div className="py-8 text-center text-xs text-slate-500">
            <p className="font-medium text-slate-700">No transaction record found</p>
            <p className="mt-1 text-slate-400">
              No Stripe payment transaction has been recorded for reference #{paymentId}.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-2 text-xs">
            {/* Amount & Status Card */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Total Amount
                </span>
                <p className="text-xl font-bold text-slate-900">
                  {formatVnd(payment.amountMinor)}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`text-xs px-2.5 py-1 uppercase font-semibold ${
                  payment.status === "PAID"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : payment.status === "FAILED"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {payment.status}
              </Badge>
            </div>

            {/* Details List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-slate-400" />
                  Transaction ID
                </span>
                <div className="flex items-center gap-1.5 font-mono text-slate-800">
                  <span className="truncate max-w-[200px]">{payment.id}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(payment.id)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Copy ID"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-slate-400" />
                  Order ID
                </span>
                <span className="font-mono text-slate-800">
                  #{payment.orderId}
                </span>
              </div>

              {payment.providerSessionId && (
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    Stripe Session ID
                  </span>
                  <span className="font-mono text-slate-600 truncate max-w-[200px]" title={payment.providerSessionId}>
                    {payment.providerSessionId}
                  </span>
                </div>
              )}

              {payment.providerPaymentId && (
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    Stripe Payment Intent
                  </span>
                  <span className="font-mono text-slate-600 truncate max-w-[200px]" title={payment.providerPaymentId}>
                    {payment.providerPaymentId}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-white">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Created At
                </span>
                <span className="text-slate-700">
                  {new Date(payment.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter showCloseButton className="text-xs text-slate-400">
          Reconciled via Stripe Webhooks
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
