import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProductByIdApi,
  deleteProductApi, 
  updateProductApi,
  createProductApi,
  getPaginatedProductsApi,
  searchProductsApi,
  getFilteredProductsApi
} from "../Api/productApi";

export const useProductsViewModel = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    subcategoryId: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  });
  
  // Manual filter trigger - only applies filters when button is clicked
  const [appliedFilters, setAppliedFilters] = useState(filters);

  // Check if any filters are active (including non-default sorting)
  const hasActiveFilters = useMemo(() => {
    const hasFilterValues = appliedFilters.subcategoryId || appliedFilters.brand || appliedFilters.minPrice || appliedFilters.maxPrice;
    const hasNonDefaultSort = appliedFilters.sortBy !== 'createdAt' || appliedFilters.sortOrder !== 'desc';
    return hasFilterValues || hasNonDefaultSort;
  }, [appliedFilters]);

  // ✅ Get Products with Pagination, Search, and Filters
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", { page, limit, query: query || undefined, appliedFilters }],
    queryFn: async () => {
      // Priority: Search > Filters/Sorting > Pagination
      if (query && query.trim()) {
        return await searchProductsApi(query.trim(), page, limit);
      }
      
      // Use filtered API if any filters are active OR sorting is not default
      if (hasActiveFilters) {
        return await getFilteredProductsApi({
          categoryId: appliedFilters.subcategoryId || undefined,
          brand: appliedFilters.brand || undefined,
          minPrice: appliedFilters.minPrice ? Number(appliedFilters.minPrice) : undefined,
          maxPrice: appliedFilters.maxPrice ? Number(appliedFilters.maxPrice) : undefined,
          sortBy: appliedFilters.sortBy,
          sortOrder: appliedFilters.sortOrder,
          page,
          limit
        });
      }
      
      // Default: simple pagination
      return await getPaginatedProductsApi(page, limit);
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  const products = data?.products || [];
  const total = data?.total || 0;

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

  // Apply filters - triggers API call
  const applyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    const emptyFilters = {
      subcategoryId: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
      sortOrder: "desc"
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  };

  // Update single filter (doesn't trigger API until applyFilters is called)
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return {
    // Data
    products,
    total,
    loading: isLoading,
    error: error?.message || null,
    
    // Pagination
    page,
    limit,
    setPage,
    setLimit: (newLimit) => {
      setLimit(newLimit);
      setPage(1);
    },
    
    // Search
    query,
    setQuery: (newQuery) => {
      setQuery(newQuery);
      setPage(1);
    },
    
    // Filters
    filters,
    appliedFilters,
    setFilters,
    updateFilter,
    applyFilters,
    clearFilters,
    hasActiveFilters,
    
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
