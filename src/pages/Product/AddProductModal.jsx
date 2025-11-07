import React, { useState, useEffect } from "react";
import { X, Upload, Trash2, Image as ImageIcon, Search } from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchSubcategories } from "../../Api/subcategoriesApi";
import { addImageToProductApi } from "../../Api/productApi";

const AddProductModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [form, setForm] = useState({
    nameEn: "",
    nameAr: "",
    price: "",
    discounts: "",
    descriptionEn: "",
    descriptionAr: "",
    brand: "",
    subcategoryId: "",
    stock: 0,
    isVerified: false,
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [subcategorySearch, setSubcategorySearch] = useState("");
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);

  // Load subcategories on mount
  useEffect(() => {
    loadSubcategories();
  }, []);

  const loadSubcategories = async () => {
    setLoadingSubcategories(true);
    try {
      const data = await fetchSubcategories();
      setSubcategories(data || []);
    } catch (error) {
      console.error("Failed to load subcategories:", error);
      toast.error("Failed to load subcategories");
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Filter subcategories based on search
  const filteredSubcategories = subcategories.filter((sub) => {
    const searchLower = subcategorySearch.toLowerCase();
    return (
      sub.name?.en?.toLowerCase().includes(searchLower) ||
      sub.name?.ar?.toLowerCase().includes(searchLower) ||
      sub._id?.toLowerCase().includes(searchLower)
    );
  });

  // Validation
  const validate = () => {
    if (!form.nameEn || !form.nameAr) {
      toast.error("Both English and Arabic product names are required");
      return false;
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error("Enter a valid product price");
      return false;
    }
    if (!form.subcategoryId) {
      toast.error("Please select a subcategory");
      return false;
    }
    if (imageUrls.length === 0) {
      toast.error("Please upload at least one product image");
      return false;
    }
    if (form.stock === undefined || Number(form.stock) < 0) {
      toast.error("Enter a valid stock quantity");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubcategorySelect = (subcategory) => {
    setForm((prev) => ({ ...prev, subcategoryId: subcategory._id }));
    setSubcategorySearch(subcategory.name?.en || subcategory.name?.ar || subcategory._id);
    setShowSubcategoryDropdown(false);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Use JPG, PNG, or WebP`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File too large: ${file.name}. Max 5MB`);
        continue;
      }

      // For new products, we need to create a temporary product first
      // OR we can use a different approach: convert to base64 or upload to cloudinary directly
      // Since the backend expects a product ID, we'll store files temporarily
      // and upload them after product creation
      
      // For now, let's convert to data URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrls(prev => [...prev, { file, preview: reader.result, uploaded: false }]);
      };
      reader.readAsDataURL(file);
    }

    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // First, create the product with basic info
    const payload = {
      name: { 
        en: form.nameEn.trim(), 
        ar: form.nameAr.trim() 
      },
      price: Number(form.price),
      discounts: form.discounts ? Number(form.discounts) : 0,
      description: { 
        en: form.descriptionEn.trim() || form.nameEn.trim(), 
        ar: form.descriptionAr.trim() || form.nameAr.trim() 
      },
      brand: form.brand.trim() || "Generic",
      imageUrls: [], // Will be populated after upload
      subcategoryId: form.subcategoryId.trim(),
      stock: Number(form.stock),
      isVerified: !!form.isVerified,
    };

    // Note: Since backend requires product ID to upload images,
    // we need to handle this differently. Let's pass the image files
    // to the parent and handle upload after product creation
    
    onSubmit(payload, {
      onSuccess: async (createdProduct) => {
        // Upload images after product is created
        if (imageUrls.length > 0 && createdProduct?._id) {
          try {
            for (const imgData of imageUrls) {
              if (imgData.file) {
                await addImageToProductApi(createdProduct._id, imgData.file);
              }
            }
            toast.success("Product and images added successfully!");
          } catch (error) {
            toast.warning("Product created but some images failed to upload");
          }
        } else {
          toast.success("Product added successfully!");
        }
        
        // Reset form
        onClose();
        setForm({
          nameEn: "",
          nameAr: "",
          price: "",
          discounts: "",
          descriptionEn: "",
          descriptionAr: "",
          brand: "",
          subcategoryId: "",
          stock: 0,
          isVerified: false,
        });
        setImageUrls([]);
        setSubcategorySearch("");
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to add product");
      },
    });
  };

  if (!isOpen) return null;

  const selectedSubcategory = subcategories.find(s => s._id === form.subcategoryId);

  return (
    <div className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="bg-white w-full sm:max-w-4xl sm:rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
          <h2 
            id="add-product-title"
            className="text-lg sm:text-xl font-semibold text-gray-900"
          >
            Add New Product
          </h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 tap-highlight-transparent touch-manipulation"
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
                value={form.nameEn}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                placeholder="Enter product name"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700 mb-2">
                Description (English)
              </label>
              <textarea
                id="descriptionEn"
                name="descriptionEn"
                value={form.descriptionEn}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation resize-none"
                placeholder="Enter product description"
                rows="3"
                disabled={isSubmitting}
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
                value={form.nameAr}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                placeholder="أدخل اسم المنتج"
                dir="rtl"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="descriptionAr" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Arabic)
              </label>
              <textarea
                id="descriptionAr"
                name="descriptionAr"
                value={form.descriptionAr}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation resize-none"
                placeholder="أدخل وصف المنتج"
                rows="3"
                dir="rtl"
                disabled={isSubmitting}
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
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                  disabled={isSubmitting}
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
                  value={form.discounts}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                  min="0"
                  max="100"
                  placeholder="0"
                  disabled={isSubmitting}
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
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                  min="0"
                  placeholder="0"
                  required
                  disabled={isSubmitting}
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
                  value={form.brand}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                  placeholder="Enter brand name"
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Subcategory Dropdown */}
              <div className="sm:col-span-2 relative">
                <label htmlFor="subcategorySearch" className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  <input
                    id="subcategorySearch"
                    type="text"
                    value={subcategorySearch}
                    onChange={(e) => {
                      setSubcategorySearch(e.target.value);
                      setShowSubcategoryDropdown(true);
                    }}
                    onFocus={() => setShowSubcategoryDropdown(true)}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                    placeholder="Search subcategories..."
                    disabled={isSubmitting || loadingSubcategories}
                  />
                </div>
                
                {/* Dropdown */}
                {showSubcategoryDropdown && !isSubmitting && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {loadingSubcategories ? (
                      <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : filteredSubcategories.length > 0 ? (
                      filteredSubcategories.map((sub) => (
                        <button
                          key={sub._id}
                          type="button"
                          onClick={() => handleSubcategorySelect(sub)}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
                        >
                          <div className="font-medium text-gray-900">{sub.name?.en || sub.name?.ar || 'Unnamed'}</div>
                          {sub.name?.en && sub.name?.ar && (
                            <div className="text-sm text-gray-500" dir="rtl">{sub.name.ar}</div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">ID: {sub._id}</div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No subcategories found</div>
                    )}
                  </div>
                )}
                
                {/* Selected subcategory display */}
                {selectedSubcategory && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                    <span className="font-medium text-blue-900">Selected: </span>
                    <span className="text-blue-700">{selectedSubcategory.name?.en || selectedSubcategory.name?.ar || 'Unnamed'}</span>
                  </div>
                )}
              </div>

              {/* Verified Checkbox */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={form.isVerified}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Mark as Verified</span>
                </label>
              </div>
            </div>

            {/* Discount Preview */}
            {form.discounts > 0 && form.price > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">
                  Price after discount:
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${(Number(form.price) - (Number(form.price) * Number(form.discounts)) / 100).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Product Images Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Product Images <span className="text-red-500">*</span>
              </h3>
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Upload size={16} aria-hidden="true" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Images'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploadingImage || isSubmitting}
                  className="hidden"
                  multiple
                  aria-label="Upload product images"
                />
              </label>
            </div>
            
            {imageUrls.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imageUrls.map((imgData, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      src={imgData.preview}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        disabled={isSubmitting}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <Trash2 size={20} aria-hidden="true" />
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
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? (
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
                  Creating Product...
                </span>
              ) : (
                <>Add Product</>
              )}
            </button>
          </div>
        </form>

        {/* Click outside to close dropdown */}
        {showSubcategoryDropdown && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowSubcategoryDropdown(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AddProductModal;
