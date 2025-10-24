import React, { useState } from "react";
import { toast } from "react-hot-toast";

/**
 * Props:
 * - isOpen (bool)
 * - onClose (fn)
 * - onSubmit (fn)  // function that calls viewmodel.createProduct
 * - isSubmitting (bool)
 */
const AddProductModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [form, setForm] = useState({
    nameEn: "",
    nameAr: "",
    price: "",
    discounts: "",
    descriptionEn: "",
    descriptionAr: "",
    brand: "",
    imageUrl: "",
    subcategoryId: "",
    stock: 0,
    isVerified: false,
  });

  // small validation
  const validate = () => {
    if (!form.nameEn && !form.nameAr) {
      toast.error("Enter the product name (EN or AR)");
      return false;
    }
    if (!form.price) {
      toast.error("Enter the product price");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: { en: form.nameEn, ar: form.nameAr },
      price: Number(form.price),
      discounts: form.discounts ? Number(form.discounts) : 0,
      description: { en: form.descriptionEn, ar: form.descriptionAr },
      brand: form.brand,
      imageUrls: form.imageUrl ? [form.imageUrl] : [],
      subcategoryId: form.subcategoryId || null,
      stock: Number(form.stock || 0),
      isVerified: !!form.isVerified,
    };

    onSubmit(payload, {
      onSuccess: () => {
        toast.success("Product added successfully");
        onClose();
        setForm({
          nameEn: "",
          nameAr: "",
          price: "",
          discounts: "",
          descriptionEn: "",
          descriptionAr: "",
          brand: "",
          imageUrl: "",
          subcategoryId: "",
          stock: 0,
          isVerified: false,
        });
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to add product");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Add New Product</h3>
            <button type="button" onClick={onClose} className="text-gray-500">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              name="nameEn"
              value={form.nameEn}
              onChange={handleChange}
              placeholder="Name (EN)"
              className="border px-3 py-2 rounded"
            />
            <input
              name="nameAr"
              value={form.nameAr}
              onChange={handleChange}
              placeholder="Name (AR)"
              className="border px-3 py-2 rounded"
            />
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              type="number"
              step="0.01"
              className="border px-3 py-2 rounded"
            />
            <input
              name="discounts"
              value={form.discounts}
              onChange={handleChange}
              placeholder="Discount (%)"
              type="number"
              className="border px-3 py-2 rounded"
            />
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="border px-3 py-2 rounded"
            />
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              type="number"
              className="border px-3 py-2 rounded"
            />
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Main Image URL"
              className="border px-3 py-2 rounded col-span-1 sm:col-span-2"
            />
            <input
              name="subcategoryId"
              value={form.subcategoryId}
              onChange={handleChange}
              placeholder="Subcategory ID (optional)"
              className="border px-3 py-2 rounded col-span-1 sm:col-span-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <textarea
              name="descriptionEn"
              value={form.descriptionEn}
              onChange={handleChange}
              placeholder="Description (EN)"
              className="border px-3 py-2 rounded min-h-[80px]"
            />
            <textarea
              name="descriptionAr"
              value={form.descriptionAr}
              onChange={handleChange}
              placeholder="Description (AR)"
              className="border px-3 py-2 rounded min-h-[80px]"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isVerified"
                checked={form.isVerified}
                onChange={handleChange}
              />
              <span>Verified</span>
            </label>

            <div className="flex-1 text-right">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium disabled:opacity-60"
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="ml-3 px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
