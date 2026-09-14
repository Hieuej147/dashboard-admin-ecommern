import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/image-uploader";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products";
import type { ProductDto } from "@/hooks/query-key/query-key";
import { parseMoneyAmount } from "@/lib/utils";
import { Loader2, Package } from "lucide-react";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductDto | null; // If provided, edit mode. Else create mode.
  onSuccess?: () => void;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormDialogProps) {
  const isEdit = Boolean(product);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [priceVnd, setPriceVnd] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setSlug(product.slug || "");
      setDescription(product.description || "");
      setStockQuantity(product.stockQuantity || 0);
      setPriceVnd(parseMoneyAmount(product.price?.amountMinor));
      setImageUrl(product.images?.main || (product.images as any)?.[0] || "");
      setSizes((product.sizes || []).join(", "));
      setColors((product.colors || []).join(", "));
      setErrorMsg("");
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setStockQuantity(0);
      setPriceVnd(0);
      setImageUrl("");
      setSizes("");
      setColors("");
      setErrorMsg("");
    }
  }, [product, open]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit && !slug) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(autoSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter a product name.");
      return;
    }

    const parsedSizes = sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedColors = colors
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const imagesPayload: Record<string, string> = imageUrl.trim()
      ? { main: imageUrl.trim() }
      : {};

    try {
      if (isEdit && product) {
        await updateMutation.mutateAsync({
          id: product.id,
          data: {
            name: name.trim(),
            description: description.trim(),
            stockQuantity: Number(stockQuantity) || 0,
            priceAmountMinor: Number(priceVnd) || 0,
            currency: "VND",
            sizes: parsedSizes,
            colors: parsedColors,
            images: imagesPayload,
          },
        });
      } else {
        const finalSlug =
          slug.trim() ||
          name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-");

        await createMutation.mutateAsync({
          slug: finalSlug,
          name: name.trim(),
          description: description.trim(),
          stockQuantity: Number(stockQuantity) || 0,
          priceAmountMinor: Number(priceVnd) || 0,
          currency: "VND",
          sizes: parsedSizes,
          colors: parsedColors,
          images: imagesPayload,
        });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to save product data."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto font-mono p-6 border-2 border-border bg-card shadow-hard-md">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#ece945] uppercase">
            <span>PRODUCT DATA REPOSITORY</span>
          </div>
          <DialogTitle className="flex items-center gap-2 text-base font-bold uppercase tracking-wider text-foreground">
            <Package className="h-4 w-4" />
            {isEdit ? "UPDATE PRODUCT DETAILS" : "ADD NEW PRODUCT"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEdit
              ? "Update specifications, retail pricing, and inventory thresholds."
              : "Provide product specifications and upload assets directly to S3 storage."}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="border border-rose-300 dark:border-rose-900/50 bg-rose-500/10 p-2.5 text-xs text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* Product Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="prod-name" className="text-xs font-bold uppercase">
              Product Name *
            </Label>
            <Input
              id="prod-name"
              placeholder="e.g., Premium Cotton Crewneck Tee"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="border-border bg-muted/20"
              required
            />
          </div>

          {/* Slug */}
          <div className="grid gap-1.5">
            <Label htmlFor="prod-slug" className="text-xs font-bold uppercase">
              URL Slug {!isEdit && "*"}
            </Label>
            <Input
              id="prod-slug"
              placeholder="premium-cotton-crewneck-tee"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={isEdit}
              className="border-border bg-muted/20"
            />
            {!isEdit && (
              <p className="text-[10px] text-muted-foreground">
                Auto-generated from title for storefront routing.
              </p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-1.5">
            <Label htmlFor="prod-desc" className="text-xs font-bold uppercase">
              Detailed Description
            </Label>
            <Textarea
              id="prod-desc"
              rows={3}
              placeholder="Specifications, material composition, features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-border bg-muted/20"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="prod-price" className="text-xs font-bold uppercase">
                Retail Price (VND) *
              </Label>
              <Input
                id="prod-price"
                type="number"
                min={0}
                placeholder="250000"
                value={priceVnd}
                onChange={(e) => setPriceVnd(Number(e.target.value))}
                className="border-border bg-muted/20"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="prod-stock" className="text-xs font-bold uppercase">
                Stock Quantity *
              </Label>
              <Input
                id="prod-stock"
                type="number"
                min={0}
                placeholder="50"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="border-border bg-muted/20"
                required
              />
            </div>
          </div>

          {/* S3 Image Uploader Component */}
          <div className="grid gap-1.5">
            <Label className="text-xs font-bold uppercase">
              Product Image (Uploaded to S3 Storage)
            </Label>
            <ImageUploader
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              folder="products"
              disabled={isPending}
            />
          </div>

          {/* Sizes & Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="prod-sizes" className="text-xs font-bold uppercase">
                Sizes (Comma separated)
              </Label>
              <Input
                id="prod-sizes"
                placeholder="S, M, L, XL"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                className="border-border bg-muted/20"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="prod-colors" className="text-xs font-bold uppercase">
                Colors (Comma separated)
              </Label>
              <Input
                id="prod-colors"
                placeholder="Black, White, Navy"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                className="border-border bg-muted/20"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="border-border text-xs uppercase cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase font-bold shadow-hard-sm cursor-pointer"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              {isEdit ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
