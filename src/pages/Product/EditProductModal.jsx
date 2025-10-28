import React, { useState, useEffect } from "react";
import { useProductById } from "../../viewmodels-state/useProductsViewModel";

const EditProductModal = ({ productId, onSubmit, onClose, isUpdating }) => {
  const { product, loading, error } = useProductById(productId);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    discount: 0, // local only for preview
    stock: 0,
    brand: "",
    description: "",
  });

  useEffect(() => {
    if (product) {
      console.log("📥 Product data loaded:", product);
      setFormData({
        name: product.name?.en || "",
        price: product.price || 0,
        discount: 0,
        stock: product.stock || 0,
        brand: product.brand || "",
        description: product.description?.en || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discount" || name === "stock"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: { en: formData.name, ar: formData.name },
      description: { en: formData.description, ar: formData.description },
      price: formData.price,
      stock: formData.stock,
      brand: formData.brand,
    };

    console.log("📤 Submitting payload:", payload);
    onSubmit(productId, payload);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl md:text-2xl font-bold">✏️ Edit Product</h2>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 disabled:opacity-50"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name.en}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isUpdating}
            />
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
                disabled={isUpdating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="100"
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Stock & Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                required
                disabled={isUpdating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description.en}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              disabled={isUpdating}
            />
          </div>

          {/* Discount Preview */}
          {formData.discount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">
                Price after discount:
              </p>
              <p className="text-2xl font-bold text-green-600">
                $
                {(
                  formData.price -
                  (formData.price * formData.discount) / 100
                ).toFixed(2)}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
