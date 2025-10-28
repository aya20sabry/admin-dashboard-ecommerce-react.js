import React, { useState } from "react";
import { useProductsViewModel } from "../../viewmodels-state/useProductsViewModel";
import ProductCard from "./ProductCard";
import ProductDetailsModal from "./ProductDetailsModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";
import ResizableTable from "../../components/common/ResizableTable";
import Pagination from "../../components/common/Pagination";
import { toast } from "react-hot-toast";

const ProductList = () => {
  const {
    products,
    loading,
    error,
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

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

  // Paginate products for table view
  const paginatedProducts = products.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(products.length / limit);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-base md:text-lg text-gray-600">
          Loading products...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg font-semibold">{error}</p>
        </div>
      </div>
    );

  if (!Array.isArray(products) || products.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-500 text-lg">No products available</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🛍️ Products</h1>
            <p className="text-gray-600 mt-1 text-sm">
              Total {products.length} products
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-200 hover:shadow-lg text-sm"
          >
            + Add New Product
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <ResizableTable
            data={paginatedProducts}
            columns={tableColumns}
            loading={loading}
            onView={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            emptyMessage="No products found"
            emptyIcon="📦"
            rowKey="id"
            tableId="products-table"
          />

          {/* Pagination */}
          {products.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={products.length}
              itemsPerPage={limit}
              onPageChange={setPage}
              onItemsPerPageChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
              itemsLabel="products"
            />
          )}
        </div>
      </div>

      {/* المودالات */}
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
