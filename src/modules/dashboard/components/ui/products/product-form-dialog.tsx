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
      setImageUrl(product.images?.main || product.images?.[0] || "");
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

  // Auto-generate slug from name if in create mode and user hasn't manually edited slug
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
      setErrorMsg("Product name is required.");
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

    const imagesPayload: Record<string, string> = imageUrl.trim() ? { main: imageUrl.trim() } : {};

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
      setErrorMsg(err?.response?.data?.message || err?.message || "Failed to save product.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-500" />
            {isEdit ? "Edit Product" : "Create New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update product details, pricing, and inventory stock."
              : "Fill in the details below to add a new product to your catalog."}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-sm">
          <div className="grid gap-2">
            <Label htmlFor="prod-name">Product Name *</Label>
            <Input
              id="prod-name"
              placeholder="e.g. Premium Cotton T-Shirt"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prod-slug">Slug {!isEdit && "*"}</Label>
            <Input
              id="prod-slug"
              placeholder="e.g. premium-cotton-t-shirt"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={isEdit} // slugs are typically immutable on backend
            />
            {!isEdit && (
              <p className="text-[11px] text-slate-400">
                Unique identifier for URL. Auto-generated from name.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prod-desc">Description</Label>
            <Textarea
              id="prod-desc"
              rows={3}
              placeholder="Detailed description of the product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="prod-price">Price (VND) *</Label>
              <Input
                id="prod-price"
                type="number"
                min={0}
                placeholder="250000"
                value={priceVnd}
                onChange={(e) => setPriceVnd(Number(e.target.value))}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prod-stock">Stock Quantity *</Label>
              <Input
                id="prod-stock"
                type="number"
                min={0}
                placeholder="50"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prod-image">Image URL</Label>
            <Input
              id="prod-image"
              type="url"
              placeholder="https://example.com/product.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="prod-sizes">Sizes (comma separated)</Label>
              <Input
                id="prod-sizes"
                placeholder="S, M, L, XL"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prod-colors">Colors (comma separated)</Label>
              <Input
                id="prod-colors"
                placeholder="Black, White, Navy"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
