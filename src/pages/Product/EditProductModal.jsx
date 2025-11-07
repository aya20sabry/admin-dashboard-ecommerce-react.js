import React, { useState, useEffect } from "react";
import { X, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { useProductById } from "../../viewmodels-state/useProductsViewModel";
import { addImageToProductApi, removeImageFromProductApi } from "../../Api/productApi";
import { toast } from "react-hot-toast";

const EditProductModal = ({ productId, onSubmit, onClose, isUpdating }) => {
  const { product, loading, error } = useProductById(productId);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(null);

  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    price: 0,
    discounts: 0,
    stock: 0,
    brand: "",
    descriptionEn: "",
    descriptionAr: "",
    subcategoryId: "",
    imageUrls: [],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        nameEn: product.name || "",
        nameAr: product.nameAr || "",
        price: product.price || 0,
        discounts: product.discount || 0,
        stock: product.stock || 0,
        brand: product.brand || "",
        descriptionEn: product.description || "",
        descriptionAr: product.descriptionAr || "",
        subcategoryId: product.subcategoryId || "",
        imageUrls: product.images || [],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discounts" || name === "stock"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid image type. Use JPG, PNG, or WebP');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const response = await addImageToProductApi(productId, file);
      const updatedProduct = response.data || response;
      
      if (updatedProduct.imageUrls) {
        setFormData(prev => ({
          ...prev,
          imageUrls: updatedProduct.imageUrls
        }));
      }
      
      toast.success('Image uploaded successfully!');
      e.target.value = '';
    } catch (error) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async (imageUrl) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    setDeletingImage(imageUrl);
    try {
      const response = await removeImageFromProductApi(productId, imageUrl);
      const updatedProduct = response.data || response;
      
      if (updatedProduct.imageUrls) {
        setFormData(prev => ({
          ...prev,
          imageUrls: updatedProduct.imageUrls
        }));
      }
      
      toast.success('Image deleted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to delete image');
    } finally {
      setDeletingImage(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: { 
        en: formData.nameEn || formData.nameAr || "Product", 
        ar: formData.nameAr || formData.nameEn || "منتج" 
      },
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    if (formData.discounts) {
      payload.discounts = Number(formData.discounts);
    }

    if (formData.descriptionEn || formData.descriptionAr) {
      payload.description = {
        en: formData.descriptionEn || "",
        ar: formData.descriptionAr || "",
      };
    }

    if (formData.brand) {
      payload.brand = formData.brand;
    }

    if (formData.subcategoryId) {
      payload.subcategoryId = formData.subcategoryId;
    }

    if (formData.imageUrls.length > 0) {
      payload.imageUrls = formData.imageUrls.filter(Boolean);
    }

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
    <div className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="bg-white w-full sm:max-w-4xl sm:rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
          <h2 
            id="edit-product-title"
            className="text-lg sm:text-xl font-semibold text-gray-900"
          >
            Edit Product
          </h2>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="inline-flex items-center justify-center min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 tap-highlight-transparent touch-manipulation disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* English Content Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              English Content
            </h3>
            <div>
              <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                id="nameEn"
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                placeholder="Enter product name"
                required
                disabled={isUpdating}
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700 mb-2">
                Description (English)
              </label>
              <textarea
                id="descriptionEn"
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation resize-none"
                placeholder="Enter product description"
                rows="3"
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Arabic Content Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Arabic Content
            </h3>
            <div>
              <label htmlFor="nameAr" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name (Arabic) <span className="text-red-500">*</span>
              </label>
              <input
                id="nameAr"
                type="text"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                placeholder="أدخل اسم المنتج"
                dir="rtl"
                required
                disabled={isUpdating}
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="descriptionAr" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Arabic)
              </label>
              <textarea
                id="descriptionAr"
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation resize-none"
                placeholder="أدخل وصف المنتج"
                rows="3"
                dir="rtl"
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Product Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                  min="0"
                  step="0.01"
                  required
                  disabled={isUpdating}
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="discounts" className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <input
                  id="discounts"
                  type="number"
                  name="discounts"
                  value={formData.discounts}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                  min="0"
                  max="100"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                  min="0"
                  required
                  disabled={isUpdating}
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  id="brand"
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                  placeholder="Enter brand name"
                  disabled={isUpdating}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory ID
                </label>
                <input
                  id="subcategoryId"
                  type="text"
                  name="subcategoryId"
                  value={formData.subcategoryId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                  placeholder="Enter subcategory ID"
                  disabled={isUpdating}
                />
              </div>
            </div>

            {/* Discount Preview */}
            {formData.discounts > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">
                  Price after discount:
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${(formData.price - (formData.price * formData.discounts) / 100).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Product Images Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Product Images
              </h3>
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Upload size={16} aria-hidden="true" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploadingImage || isUpdating}
                  className="hidden"
                  aria-label="Upload product image"
                />
              </label>
            </div>
            
            {formData.imageUrls.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formData.imageUrls.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200?text=Image+Error';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleImageDelete(imageUrl)}
                        disabled={deletingImage === imageUrl || isUpdating}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        aria-label={`Delete image ${index + 1}`}
                      >
                        {deletingImage === imageUrl ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        ) : (
                          <Trash2 size={20} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                <p className="mt-2 text-sm text-gray-500">No images uploaded yet</p>
                <p className="text-xs text-gray-400 mt-1">Upload images using the button above</p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isUpdating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                <>Update Product</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
