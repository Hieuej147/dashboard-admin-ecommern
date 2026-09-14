import React, { useRef, useState } from "react";
import { UploadCloud, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useUploadProductImage } from "@/hooks/use-products";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  disabled?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  folder = "products",
  disabled = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadProductImage();

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are supported (PNG, JPG, WEBP, AVIF, GIF).");
      return;
    }

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File too large. Maximum size is 10MB.");
      return;
    }

    setUploadError(null);
    try {
      const res = await uploadMutation.mutateAsync({ file, folder });
      onChange(res.publicUrl);
    } catch (err: any) {
      setUploadError(err?.message || "Failed to upload image to S3 storage. Please try again.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploadMutation.isPending) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !uploadMutation.isPending) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="space-y-3 font-mono">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            void handleFile(e.target.files[0]);
          }
        }}
        accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
        className="hidden"
        disabled={disabled || uploadMutation.isPending}
      />

      {value ? (
        // Uploaded Preview Card
        <div className="border border-border bg-card p-3 space-y-3">
          <div className="flex items-start gap-3">
            <div className="relative h-24 w-24 shrink-0 border border-border bg-muted/20 overflow-hidden flex items-center justify-center">
              <img
                src={value}
                alt="Product preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='1.5'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                }}
              />
              <span className="absolute top-1 left-1 bg-[#ece945] text-black text-[8px] font-bold px-1 border border-black/20">
                S3 ASSET
              </span>
            </div>

            <div className="flex-1 min-w-0 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>STORED ON S3 STORAGE</span>
              </div>
              <div className="truncate text-muted-foreground text-[11px] bg-muted/40 p-1 border border-border/60 select-all">
                {value}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || uploadMutation.isPending}
                  className="px-2.5 py-1 text-[11px] font-bold border border-border bg-muted hover:bg-muted/80 text-foreground transition-colors cursor-pointer"
                >
                  Change image
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  disabled={disabled || uploadMutation.isPending}
                  className="px-2.5 py-1 text-[11px] font-bold border border-rose-300 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  Remove image
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Dropzone Area
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && !uploadMutation.isPending && fileInputRef.current?.click()}
          className={`border-2 border-dashed p-6 text-center transition-all cursor-pointer select-none ${
            isDragging
              ? "border-[#ece945] bg-[#ece945]/5 text-foreground"
              : "border-border hover:border-foreground/50 bg-card hover:bg-muted/20"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {uploadMutation.isPending ? (
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <Loader2 className="h-8 w-8 animate-spin text-[#ece945]" />
              <div className="text-xs font-bold uppercase tracking-wider text-foreground">
                Uploading asset to S3 storage...
              </div>
              <div className="text-[10px] text-muted-foreground">
                Synchronizing file payload...
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="h-10 w-10 border border-border bg-muted/40 flex items-center justify-center text-muted-foreground">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                  DROP IMAGE HERE OR CLICK TO BROWSE
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Supported: PNG, JPG, WEBP, AVIF (Max: 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 p-2 border border-rose-300 dark:border-rose-900/50 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
