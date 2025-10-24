import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProductsApi, 
  getProductByIdApi,
  deleteProductApi, 
  updateProductApi,
  createProductApi
} from "../Api/productApi";

export const useProductsViewModel = () => {
  const queryClient = useQueryClient();

  // ✅ Get All Products
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProductsApi,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // ✅ Delete Product Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  // ✅ Update Product Mutation
  const updateMutation = useMutation({
    mutationFn: ({ productId, productData }) => 
      updateProductApi(productId, productData),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  // ✅ Create Product Mutation
  const createMutation = useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  return {
    products,
    loading: isLoading,
    error: error?.message || null,
    
    // Delete
    deleteProduct: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error?.message || null,
    
    // Update
    updateProduct: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error?.message || null,

    // Create
    createProduct: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error?.message || null,
  };
};

// ✅ Hook منفصل لجلب منتج واحد
export const useProductById = (productId) => {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductByIdApi(productId),
    enabled: !!productId,
    retry: 1,
  });

  return {
    product,
    loading: isLoading,
    error: error?.message || null,
  };
};
