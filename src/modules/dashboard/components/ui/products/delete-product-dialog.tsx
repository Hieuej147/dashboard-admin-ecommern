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
      <DialogContent className="sm:max-w-md font-mono border-2 border-border bg-card shadow-hard-md p-6">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
            <div className="flex h-9 w-9 items-center justify-center border border-rose-500/30 bg-rose-500/10">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
                CONFIRM PRODUCT DELETION
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                This operation will permanently remove the product from the catalog.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errorMsg && (
          <div className="border border-rose-300 dark:border-rose-900/50 bg-rose-500/10 p-2.5 text-xs text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        <div className="py-2 text-xs text-foreground/80 leading-relaxed">
          Are you sure you want to delete product{" "}
          <strong className="text-foreground font-bold">
            "{product.name}"
          </strong>{" "}
          (SKU: {product.sku || product.slug})?
        </div>

        <DialogFooter className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
            className="border-border text-xs uppercase cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-xs uppercase font-bold shadow-hard-sm cursor-pointer"
          >
            {deleteMutation.isPending && (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            )}
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
