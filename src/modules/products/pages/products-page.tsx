import { useState, useMemo, useCallback } from "react";
import { useProducts } from "@/hooks/use-products";
import type { ProductDto } from "@/hooks/query-key/query-key";
import {
  ProductsHeader,
  ProductsFilterBar,
  ProductsTable,
  ProductsPagination,
  ProductFormDialog,
  DeleteProductDialog,
} from "../";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductDto | null>(null);

  const {
    products,
    page,
    hasNextPage,
    hasPrevPage,
    goNextPage,
    goPrevPage,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
    prefetchNextPage,
  } = useProducts({ search, status: status === "all" ? undefined : status });

  // Filter products by derived status (ACTIVE, LOW_STOCK, OUT_OF_STOCK)
  const filteredProducts = useMemo(() => {
    if (!status || status === "all") return products;
    return products.filter((product) => {
      const derivedStatus =
        product.stockQuantity === 0
          ? "OUT_OF_STOCK"
          : product.stockQuantity <= 10
            ? "LOW_STOCK"
            : "ACTIVE";
      return derivedStatus === status;
    });
  }, [products, status]);

  const handleOpenCreate = useCallback(() => {
    setSelectedProduct(null);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((product: ProductDto) => {
    setSelectedProduct(product);
    setFormOpen(true);
  }, []);

  const handleOpenDelete = useCallback((product: ProductDto) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  }, []);

  const handleRefetch = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="flex flex-col gap-6">
      <ProductsHeader onOpenCreate={handleOpenCreate} />

      <ProductsFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden">
        <ProductsTable
          products={filteredProducts}
          isPending={isPending}
          isFetching={isFetching}
          isError={isError}
          error={error}
          onRefetch={handleRefetch}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />

        <ProductsPagination
          page={page}
          totalItems={filteredProducts.length}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          isFetching={isFetching}
          isPending={isPending}
          onPrevPage={goPrevPage}
          onNextPage={goNextPage}
          onPrefetchNextPage={prefetchNextPage}
        />
      </div>

      {/* Create / Edit Dialog */}
      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={selectedProduct}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteProductDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={productToDelete}
      />
    </div>
  );
}
