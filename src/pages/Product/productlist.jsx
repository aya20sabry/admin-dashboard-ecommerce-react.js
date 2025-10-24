import React, { useState } from "react";
import { useProductsViewModel } from "../../viewmodels-state/useProductsViewModel";
import ProductCard from "./ProductCard";
import ProductDetailsModal from "./ProductDetailsModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProductModal";
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
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});

  // ✅ تجميع المنتجات حسب category > subcategory
  const groupedByCategory = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    const subcategory = product.subcategory || "Other";

    if (!acc[category]) acc[category] = {};
    if (!acc[category][subcategory]) acc[category][subcategory] = [];

    acc[category][subcategory].push(product);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleSubcategory = (category, subcategory) => {
    const key = `${category}-${subcategory}`;
    setExpandedSubcategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
      }
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
              Total {products.length} products in{" "}
              {Object.keys(groupedByCategory).length} categories
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
          {Object.entries(groupedByCategory).map(([category, subcategories]) => {
            const isExpanded = expandedCategories[category] !== false;

            return (
              <div
                key={category}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">📂</span>
                    <div className="text-left">
                      <h2 className="text-xl font-bold">{category}</h2>
                      <p className="text-blue-100 text-sm">
                        {Object.values(subcategories).flat().length} products
                      </p>
                    </div>
                  </div>
                  <div
                    className={`transform transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ${
                    isExpanded
                      ? "max-h-[10000px] opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  {Object.entries(subcategories).map(
                    ([subcategory, subProducts]) => {
                      const subKey = `${category}-${subcategory}`;
                      const isSubExpanded =
                        expandedSubcategories[subKey] !== false;

                      return (
                        <div
                          key={subcategory}
                          className="border-t border-gray-200"
                        >
                          <button
                            onClick={() =>
                              toggleSubcategory(category, subcategory)
                            }
                            className="w-full px-6 py-3 flex items-center justify-between bg-gray-100 hover:bg-gray-200"
                          >
                            <div className="flex items-center gap-2 text-gray-800 font-medium">
                              <span>📁</span> {subcategory}
                            </div>
                            <div
                              className={`transform transition-transform ${
                                isSubExpanded ? "rotate-180" : ""
                              }`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </button>

                          {/* منتجات الفئة الفرعية */}
                          <div
                            className={`transition-all duration-300 ${
                              isSubExpanded
                                ? "max-h-[10000px] opacity-100"
                                : "max-h-0 opacity-0 overflow-hidden"
                            }`}
                          >
                            <div className="p-6 bg-gray-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {subProducts.map((product) => (
                                <ProductCard
                                  key={product.id}
                                  product={product}
                                  onViewDetails={handleViewDetails}
                                  onEdit={handleEdit}
                                  onDelete={handleDeleteClick}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
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
