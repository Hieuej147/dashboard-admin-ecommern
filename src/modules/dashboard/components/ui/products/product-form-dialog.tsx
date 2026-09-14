import { useEffect, useRef, useState } from "react";
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
import { useCreateProduct, useUpdateProduct, useUploadProductImage } from "@/hooks/use-products";
import type { ProductDto } from "@/hooks/query-key/query-key";
import { parseMoneyAmount } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import {
  Loader2,
  Package,
  Plus,
  Trash2,
  UploadCloud,
  X,
  Layers,
  Palette,
  Image as ImageIcon,
} from "lucide-react";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductDto | null; // If provided, edit mode. Else create mode.
  onSuccess?: () => void;
}

interface GalleryItem {
  id: string;
  url: string;
  colorKey: string;
}

const STOREFRONT_CATEGORIES = [
  { slug: "jackets", label: "JACKETS" },
  { slug: "t-shirts", label: "T-SHIRTS" },
  { slug: "shoes", label: "SHOES" },
  { slug: "accessories", label: "ACCESSORIES" },
  { slug: "bags", label: "BAGS" },
  { slug: "gloves", label: "GLOVES" },
  { slug: "pants", label: "PANTS" },
  { slug: "equipment", label: "EQUIPMENT" },
];

const PRESET_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "FREE SIZE"];
const PRESET_COLORS = ["Black", "White", "Olive", "Navy", "Gray", "Khaki"];

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormDialogProps) {
  const isEdit = Boolean(product);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categorySlug, setCategorySlug] = useState("jackets");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [priceVnd, setPriceVnd] = useState<number>(0);
  const [reorderPoint, setReorderPoint] = useState<number>(20);
  const [status, setStatus] = useState<string>("ACTIVE");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [customSize, setCustomSize] = useState("");
  const [colorList, setColorList] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState("");
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const uploadMutation = useUploadProductImage();

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setSlug(product.slug || "");
      setCategorySlug(product.categorySlug || "jackets");
      setDescription(product.description || "");
      setStockQuantity(product.stockQuantity || 0);
      setPriceVnd(parseMoneyAmount(product.price?.amountMinor));
      setReorderPoint(product.reorderPoint !== undefined ? product.reorderPoint : 20);
      setStatus(product.status || "ACTIVE");
      setSelectedSizes(product.sizes || []);
      setColorList(product.colors || []);

      // Parse gallery from product.images
      const imagesMap = (product.images as Record<string, string>) || {};
      const items: GalleryItem[] = Object.entries(imagesMap).map(([key, url], idx) => ({
        id: `${idx}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        url,
        colorKey: key,
      }));
      setGallery(items);
      setErrorMsg("");
    } else {
      setName("");
      setSlug("");
      setCategorySlug("jackets");
      setDescription("");
      setStockQuantity(0);
      setPriceVnd(0);
      setReorderPoint(20);
      setStatus("ACTIVE");
      setSelectedSizes(["M", "L", "XL"]);
      setColorList(["Black", "Olive"]);
      setGallery([]);
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

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleAddCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customSize.trim().toUpperCase();
    if (clean && !selectedSizes.includes(clean)) {
      setSelectedSizes((prev) => [...prev, clean]);
      setCustomSize("");
    }
  };

  const addColor = (color: string) => {
    const clean = color.trim();
    if (clean && !colorList.includes(clean)) {
      setColorList((prev) => [...prev, clean]);
    }
  };

  const handleAddCustomColor = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customColor.trim();
    if (clean && !colorList.includes(clean)) {
      setColorList((prev) => [...prev, clean]);
      setCustomColor("");
    }
  };

  const removeColor = (color: string) => {
    setColorList((prev) => prev.filter((c) => c !== color));
  };

  const handleUploadFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Only image assets are supported (PNG, JPG, WEBP, AVIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File exceeds 10MB threshold limit.");
      return;
    }

    setErrorMsg("");
    setIsUploading(true);

    try {
      const res = await uploadMutation.mutateAsync({ file, folder: "products" });
      const defaultRole =
        gallery.length === 0 ? "main" : colorList[gallery.length - 1] || "detail";

      const newItem: GalleryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        url: res.publicUrl,
        colorKey: defaultRole,
      };

      setGallery((prev) => [...prev, newItem]);

      toast.create({
        title: "ASSET UPLOADED",
        description: `Asset ${file.name} uploaded to MinIO repository.`,
        type: "success",
      });
    } catch (err: any) {
      const msg = err?.message || "Failed to upload asset to storage.";
      setErrorMsg(msg);
      toast.create({
        title: "ACTION FAILED",
        description: msg,
        type: "error",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpdateImageRole = (id: string, newRole: string) => {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, colorKey: newRole } : item)),
    );
  };

  const handleRemoveImage = (id: string) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please provide a product title.");
      return;
    }

    // Convert gallery items into images Record
    const imagesPayload: Record<string, string> = {};
    gallery.forEach((item, idx) => {
      const key = item.colorKey || (idx === 0 ? "main" : `extra_${idx}`);
      imagesPayload[key] = item.url;
    });

    // Ensure main key exists if any images uploaded
    if (!imagesPayload.main && gallery.length > 0) {
      imagesPayload.main = gallery[0].url;
    }

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
            categorySlug,
            reorderPoint: Number(reorderPoint) || 20,
            status,
            sizes: selectedSizes,
            colors: colorList,
            images: imagesPayload,
          },
        });

        toast.create({
          title: "PRODUCT UPDATED",
          description: `Product "${name.trim()}" modifications deployed.`,
          type: "success",
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
          categorySlug,
          reorderPoint: Number(reorderPoint) || 20,
          sizes: selectedSizes,
          colors: colorList,
          images: imagesPayload,
        });

        toast.create({
          title: "PRODUCT CREATED",
          description: `Product "${name.trim()}" successfully registered.`,
          type: "success",
        });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to persist product data.";
      setErrorMsg(msg);
      toast.create({
        title: "ACTION FAILED",
        description: msg,
        type: "error",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto font-mono p-6 border-2 border-border bg-card shadow-hard-md select-none">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#ece945] uppercase">
            <span>CATALOG DATA MANIFEST</span>
          </div>
          <DialogTitle className="flex items-center gap-2 text-base font-bold uppercase tracking-wider text-foreground">
            <Package className="h-4 w-4" />
            {isEdit ? "UPDATE PRODUCT RECORD" : "CREATE NEW PRODUCT"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEdit
              ? "Modify specifications, retail pricing, multi-image mappings, and inventory controls."
              : "Register product manifest and upload multi-angle assets directly to MinIO storage."}
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="border border-rose-300 dark:border-rose-900/50 bg-rose-500/10 p-2.5 text-xs text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* Row 1: Product Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 grid gap-1.5">
              <Label htmlFor="prod-name" className="text-xs font-bold uppercase">
                Product Name *
              </Label>
              <Input
                id="prod-name"
                placeholder="e.g., Tactical Waterproof Field Jacket"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="border-border bg-muted/20"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="prod-cat" className="text-xs font-bold uppercase">
                Category *
              </Label>
              <select
                id="prod-cat"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="h-9 border border-border bg-muted/20 px-2 text-xs font-bold uppercase tracking-wider text-foreground outline-none focus:border-foreground cursor-pointer"
              >
                {STOREFRONT_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: URL Slug (Auto-generated) */}
          <div className="grid gap-1.5">
            <Label htmlFor="prod-slug" className="text-xs font-bold uppercase">
              URL Slug {!isEdit && "*"}
            </Label>
            <Input
              id="prod-slug"
              placeholder="tactical-waterproof-field-jacket"
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

          {/* Row 3: Description */}
          <div className="grid gap-1.5">
            <Label htmlFor="prod-desc" className="text-xs font-bold uppercase">
              Specifications & Description
            </Label>
            <Textarea
              id="prod-desc"
              rows={3}
              placeholder="Material composition, weatherproofing specs, cut details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-border bg-muted/20"
            />
          </div>

          {/* Row 4: Price, Stock, Reorder Point & Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="prod-price" className="text-xs font-bold uppercase">
                Price (VND) *
              </Label>
              <Input
                id="prod-price"
                type="number"
                min={0}
                placeholder="1200000"
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
                placeholder="40"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="border-border bg-muted/20"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="prod-reorder" className="text-xs font-bold uppercase">
                Reorder Alert
              </Label>
              <Input
                id="prod-reorder"
                type="number"
                min={0}
                placeholder="20"
                value={reorderPoint}
                onChange={(e) => setReorderPoint(Number(e.target.value))}
                className="border-border bg-muted/20"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="prod-status" className="text-xs font-bold uppercase">
                Status
              </Label>
              <select
                id="prod-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-9 border border-border bg-muted/20 px-2 text-xs font-bold uppercase tracking-wider text-foreground outline-none focus:border-foreground cursor-pointer"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          {/* Row 5: Size Matrix (Quick Chips) */}
          <div className="grid gap-1.5 border border-border bg-muted/10 p-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-foreground" />
                Available Sizes
              </Label>
              <span className="text-[10px] text-muted-foreground">
                ({selectedSizes.length} SIZES SELECTED)
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-1">
              {PRESET_SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-2.5 py-1 text-[11px] font-bold border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-foreground text-background border-foreground shadow-hard-sm"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Input
                placeholder="Add custom size (e.g. 42, OS)..."
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                className="h-8 border-border bg-background text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCustomSize}
                className="h-8 text-xs font-bold uppercase border-border cursor-pointer shrink-0"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Size
              </Button>
            </div>
          </div>

          {/* Row 6: Color Palette & Swatches */}
          <div className="grid gap-1.5 border border-border bg-muted/10 p-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-foreground" />
                Product Colors
              </Label>
              <span className="text-[10px] text-muted-foreground">
                ({colorList.length} COLORS REGISTERED)
              </span>
            </div>

            {/* Registered Color Tags */}
            <div className="flex flex-wrap gap-1.5 min-h-7 items-center">
              {colorList.length === 0 ? (
                <span className="text-[11px] text-muted-foreground italic">
                  No colors registered yet. Add colors below for image-mapping.
                </span>
              ) : (
                colorList.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-border bg-card text-xs font-bold text-foreground shadow-hard-sm"
                  >
                    <span className="h-2 w-2 rounded-full border border-black/20 bg-muted-foreground" />
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="text-muted-foreground hover:text-rose-500 cursor-pointer ml-1"
                      aria-label={`Remove color ${color}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Quick Add Presets & Custom Input */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-border/60">
              <span className="text-[10px] text-muted-foreground uppercase font-bold mr-1">
                Quick Presets:
              </span>
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => addColor(preset)}
                  disabled={colorList.includes(preset)}
                  className="px-2 py-0.5 text-[10px] font-bold border border-border/80 bg-background text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
                >
                  +{preset}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Input
                placeholder="Or custom color (e.g. Desert Tan, #2A2F35)..."
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="h-8 border-border bg-background text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCustomColor}
                className="h-8 text-xs font-bold uppercase border-border cursor-pointer shrink-0"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Color
              </Button>
            </div>
          </div>

          {/* Row 7: Multi-Image Gallery & Color Mapping */}
          <div className="grid gap-2 border border-border bg-muted/10 p-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-bold uppercase flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-foreground" />
                  Media Gallery & Color Mapping
                </Label>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Upload multiple product angles. Map each asset to a specific color variant for dynamic storefront switching.
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#ece945] bg-black px-1.5 py-0.5 border border-border">
                {gallery.length} ASSETS
              </span>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  void handleUploadFile(e.target.files[0]);
                }
              }}
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="hidden"
              disabled={isPending || isUploading}
            />

            {/* Upload Action Bar */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending || isUploading}
                className="h-9 text-xs font-bold uppercase border-border bg-card hover:bg-muted cursor-pointer shadow-hard-sm"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin text-[#ece945]" />
                    Uploading to MinIO...
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-3.5 w-3.5 mr-2 text-foreground" />
                    Upload Image Asset
                  </>
                )}
              </Button>
              <span className="text-[10px] text-muted-foreground">
                Max 10MB per asset (PNG, JPG, WEBP).
              </span>
            </div>

            {/* Gallery Cards List */}
            {gallery.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {gallery.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2.5 border border-border bg-card p-2 shadow-hard-sm"
                  >
                    <div className="relative h-14 w-14 shrink-0 border border-border bg-muted/20 overflow-hidden">
                      <img
                        src={item.url}
                        alt={`Asset ${idx + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                        }}
                      />
                      {item.colorKey === "main" && (
                        <span className="absolute top-0 left-0 bg-[#ece945] text-black text-[7px] font-bold px-1">
                          MAIN
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground font-bold">
                          ASSET #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(item.id)}
                          className="text-muted-foreground hover:text-rose-500 cursor-pointer p-0.5"
                          title="Remove asset"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Role / Color Selector */}
                      <select
                        value={item.colorKey}
                        onChange={(e) => handleUpdateImageRole(item.id, e.target.value)}
                        className="w-full h-7 border border-border bg-muted/30 px-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground outline-none focus:border-foreground cursor-pointer"
                      >
                        <option value="main">[ MAIN / DEFAULT DISPLAY ]</option>
                        {colorList.map((c) => (
                          <option key={c} value={c}>
                            COLOR VARIANT: {c.toUpperCase()}
                          </option>
                        ))}
                        <option value="detail">[ DETAIL / CLOSE-UP ]</option>
                        <option value="back">[ BACK VIEW ]</option>
                        <option value="extra">[ EXTRA PERSPECTIVE ]</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                No product assets uploaded yet. Click above to add images.
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 pt-3 border-t border-border flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending || isUploading}
              className="border-border text-xs uppercase cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase font-bold shadow-hard-sm cursor-pointer"
              disabled={isPending || isUploading}
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
