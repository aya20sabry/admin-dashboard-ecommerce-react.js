import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useProductsViewModel } from "../../viewmodels-state/useProductsViewModel";
import ProductDetailsModal from "./ProductDetailsModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";
import ProductSearchAndFilters from "../../components/Product/ProductSearchAndFilters";
import ResizableTable from "../../components/common/ResizableTable";
import Pagination from "../../components/common/Pagination";
import { toast } from "react-hot-toast";

const ProductList = () => {
  const {
    products,
    total,
    loading,
    error,
    page,
    limit,
    query,
    filters,
    appliedFilters,
    hasActiveFilters,
    setPage,
    setLimit,
    setQuery,
    updateFilter,
    applyFilters,
    clearFilters,
    deleteProduct,
    isDeleting,
    updateProduct,
    isUpdating,
    createProduct,
    isCreating,
  } = useProductsViewModel();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productIdToEdit, setProductIdToEdit] = useState(null);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleEdit = (product) => {
    setProductIdToEdit(product.id);
    setShowEditModal(true);
  };

  const handleEditSubmit = (productId, updatedData) => {
    updateProduct(
      { productId, productData: updatedData },
      {
        onSuccess: () => {
          setShowEditModal(false);
          toast.success("✅ Product updated successfully!");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update product");
        },
      },
    );
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    deleteProduct(productToDelete.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
        toast.success("🗑️ Product deleted successfully!");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete product");
      },
    });
  };

  const handleClearAll = () => {
    setQuery("");
    clearFilters();
  };

  // Define table columns for table view
  const tableColumns = [
    {
      key: "name",
      title: "Product Name",
      render: (value, product) => (
        <div className="text-sm font-medium text-gray-900">
          {product.name || "-"}
        </div>
      ),
    },
    {
      key: "category",
      title: "Category",
      render: (value, product) => (
        <div className="text-sm text-gray-700">{product.category || "-"}</div>
      ),
    },
    {
      key: "subcategory",
      title: "Subcategory",
      render: (value, product) => (
        <div className="text-sm text-gray-600">
          {product.subcategory || "-"}
        </div>
      ),
    },
    {
      key: "price",
      title: "Price",
      render: (value, product) => (
        <div className="text-sm font-semibold text-gray-900">
          ${product.price || "0.00"}
        </div>
      ),
    },
    {
      key: "stock",
      title: "Stock",
      render: (value, product) => (
        <div className="text-sm text-gray-700">
          {product.stock !== undefined ? product.stock : "-"}
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm  z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🛍️ Products</h1>
              <p className="text-gray-600 mt-1 text-sm">
                {query ? `Found ${total} products` : hasActiveFilters ? `Filtered ${total} products` : `Total ${total} products`}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-200 hover:shadow-lg text-sm"
            >
              <Plus size={20} />
              Add New Product
            </button>
          </div>

          {/* Search and Filter Component */}
          <ProductSearchAndFilters
            searchQuery={query}
            onSearchChange={setQuery}
            filters={filters}
            appliedFilters={appliedFilters}
            onFilterChange={updateFilter}
            onApplyFilters={applyFilters}
            onClearAll={handleClearAll}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-red-800 font-medium">Error loading products</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          <ResizableTable
            data={products}
            columns={tableColumns}
            loading={loading}
            onView={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            emptyMessage={query ? "No products found matching your search" : hasActiveFilters ? "No products match your filters" : "No products found"}
            emptyIcon="📦"
            rowKey="id"
            tableId="products-table"
          />

          {/* Pagination */}
          {total > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              itemsPerPage={limit}
              onPageChange={setPage}
              onItemsPerPageChange={setLimit}
              itemsLabel="products"
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showEditModal && productIdToEdit && (
        <EditProductModal
          productId={productIdToEdit}
          onSubmit={handleEditSubmit}
          onClose={() => setShowEditModal(false)}
          isUpdating={isUpdating}
        />
      )}

      {showDeleteModal && productToDelete && (
        <DeleteConfirmModal
          product={productToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setProductToDelete(null);
          }}
          isLoading={isDeleting}
        />
      )}

      {showAddModal && (
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={(payload, options) =>
            createProduct(payload, {
              ...options,
              onSuccess: () => {
                toast.success("✅ Product added successfully!");
                setShowAddModal(false);
              },
              onError: (err) => {
                toast.error(err?.message || "Failed to add product");
              },
            })
          }
          isSubmitting={isCreating}
        />
      )}
    </div>
  );
};

export default ProductList;
