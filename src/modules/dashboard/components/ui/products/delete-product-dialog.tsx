import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/hooks/use-products";
import type { ProductDto } from "@/hooks/query-key/query-key";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductDto | null;
  onSuccess?: () => void;
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: DeleteProductDialogProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const deleteMutation = useDeleteProduct();

  if (!product) return null;

  const handleDelete = async () => {
    setErrorMsg("");
    try {
      await deleteMutation.mutateAsync(product.id);
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to delete product.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 text-rose-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base text-slate-900">
                Delete Product
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                This action will archive this product from your store.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errorMsg && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {errorMsg}
          </div>
        )}

        <div className="py-2 text-sm text-slate-600">
          Are you sure you want to delete{" "}
          <strong className="text-slate-900 font-semibold">
            "{product.name}"
          </strong>{" "}
          (SKU: {product.sku || product.slug})?
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
