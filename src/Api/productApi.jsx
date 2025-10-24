import axiosInstance from "./axiosInstance";
import { createProduct } from "../models/Product.model";

// ✅ Get All Products
export const getProductsApi = async () => {
  try {
    const response = await axiosInstance.get("/products");
    const data = response.data.data || [];
    return data.map((p) => createProduct(p));
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    throw new Error(error.response?.data?.message || "فشل في تحميل المنتجات");
  }
};

// ✅ Get Single Product - للتعديل
export const getProductByIdApi = async (productId) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    return createProduct(response.data.data);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    throw new Error(error.response?.data?.message || "فشل في تحميل المنتج");
  }
};

// ✅ Update Product
export const updateProductApi = async (productId, productData) => {
  try {
    const response = await axiosInstance.put(`/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating product:", error);
    throw new Error(error.response?.data?.message || "فشل في تحديث المنتج");
  }
};

// ✅ Delete Product
export const deleteProductApi = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    throw new Error(error.response?.data?.message || "فشل في حذف المنتج");
  }
};



// ✅ Create Product
export const createProductApi = async (productData) => {
  try {
    const response = await axiosInstance.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating product:", error);
    throw new Error(error.response?.data?.message || "فشل في إضافة المنتج");
  }
};

