import axiosInstance from "./axiosInstance";
import { createProduct } from "../models/Product.model";

// ✅ Get Single Product
export const getProductByIdApi = async (productId) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    console.log("Product data:", response.data.data);
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

// ✅ Add Image to Product (File Upload)
export const addImageToProductApi = async (productId, file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axiosInstance.post(
      `/products/${productId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error adding image:", error);
    throw new Error(error.response?.data?.message || "فشل في إضافة الصورة");
  }
};

// ✅ Remove Image from Product
export const removeImageFromProductApi = async (productId, imageUrl) => {
  try {
    const response = await axiosInstance.delete(
      `/products/${productId}/images`,
      { data: { imageUrl } }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error removing image:", error);
    throw new Error(error.response?.data?.message || "فشل في حذف الصورة");
  }
};

// ✅ Search Products
export const searchProductsApi = async (query, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get("/products/search", {
      params: { query }
    });
    
    const responseData = response.data.data || response.data;
    
    if (response.data.success && responseData) {
      const products = (Array.isArray(responseData) ? responseData : []).map((p) => createProduct(p));
      
      // Manual pagination since backend doesn't paginate search
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedProducts = products.slice(start, end);
      
      return {
        products: paginatedProducts,
        total: products.length,
        page,
        limit
      };
    }
    
    return { products: [], total: 0, page, limit };
  } catch (error) {
    console.error("❌ Error searching products:", error);
    throw new Error(error.response?.data?.message || "فشل في البحث عن المنتجات");
  }
};

// ✅ Get Paginated Products
export const getPaginatedProductsApi = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get("/products/pagination", {
      params: { page, limit }
    });
    
    const data = response.data.data;
    // console.log(data.data.products);
    
    return {
      products: (data.products || []).map((p) => createProduct(p)),
      total: data.totalCount || 0,
      page,
      limit
    };
  } catch (error) {
    console.error("❌ Error fetching paginated products:", error);
    throw new Error(error.response?.data?.message || "فشل في تحميل المنتجات");
  }
};

// ✅ Get Filtered Products (using /products/filtered endpoint)
export const getFilteredProductsApi = async ({
  categoryId,
  brand,
  minPrice,
  maxPrice,
  sortBy = 'price',
  sortOrder = 'desc',
  page = 1,
  limit = 10
} = {}) => {
  try {
    const params = {
      page,
      limit,
      sortBy,
      sortOrder
    };
    
    if (categoryId) params.categoryId = categoryId;
    if (brand) params.brand = brand;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    
    const response = await axiosInstance.get("/products/filtered", { params });
    
    // Handle response structure: response.data.data or response.data
    const data = response.data.data || response.data;
    
    return {
      products: (data.products || []).map((p) => createProduct(p)),
      total: data.totalCount || 0,
      page,
      limit
    };
  } catch (error) {
    console.error("❌ Error fetching filtered products:", error);
    throw new Error(error.response?.data?.message || "فشل في تصفية المنتجات");
  }
};

