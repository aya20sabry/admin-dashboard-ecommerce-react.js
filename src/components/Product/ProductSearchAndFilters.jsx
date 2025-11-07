import React, { useState, useEffect } from "react";
import { Search, Filter, X, Check } from "lucide-react";
import { fetchSubcategories } from "../../Api/subcategoriesApi";

/**
 * ProductSearchAndFilters Component
 * 
 * Handles search and filtering for products with:
 * - Debounced search input
 * - Subcategory, brand, and price range filters
 * - Sort by and order options
 * - Manual apply button for filters
 * - Clear all functionality
 */
const ProductSearchAndFilters = ({
  // Search props
  searchQuery,
  onSearchChange,
  
  // Filter props
  filters,
  appliedFilters,
  onFilterChange,
  onApplyFilters,
  onClearAll,
  hasActiveFilters,
  
  // UI customization
  className = "",
}) => {
  // Local state for debounced inputs
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [localFilters, setLocalFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);
  
  // Subcategories for filter dropdown
  const [subcategories, setSubcategories] = useState([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

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
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Debounced search (500ms)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(searchInput);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput, onSearchChange]);

  // Sync local filters with parent when they change externally
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Check if filters have changed (to enable/disable Apply button)
  const filtersChanged = JSON.stringify(filters) !== JSON.stringify(appliedFilters);

  // Handle local filter change
  const handleLocalFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(key, value);
  };

  // Handle clear all
  const handleClearAll = () => {
    setSearchInput("");
    setLocalFilters({
      subcategoryId: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
      sortOrder: "desc"
    });
    onClearAll();
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
              size={20}
            />
            <input
              type="search"
              placeholder="Search products by name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              hasActiveFilters || showFilters
                ? "bg-blue-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter size={18} />
            Filters
            {hasActiveFilters && (
              <span className="bg-white text-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                !
              </span>
            )}
          </button>

          {/* Clear All Button */}
          {(searchQuery || hasActiveFilters) && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
            >
              <X size={18} />
              Clear All
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Subcategory Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <select
                  value={localFilters.subcategoryId}
                  onChange={(e) => handleLocalFilterChange("subcategoryId", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loadingSubcategories}
                >
                  <option value="">All Subcategories</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name?.en || sub.name?.ar || "Unnamed"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  placeholder="Enter brand name"
                  value={localFilters.brand}
                  onChange={(e) => handleLocalFilterChange("brand", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={localFilters.minPrice}
                  onChange={(e) => handleLocalFilterChange("minPrice", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="999999"
                  value={localFilters.maxPrice}
                  onChange={(e) => handleLocalFilterChange("maxPrice", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Sort Options and Apply Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    value={localFilters.sortBy}
                    onChange={(e) => handleLocalFilterChange("sortBy", e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="createdAt">Date Added</option>
                    <option value="price">Price</option>
                    <option value="name">Name</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Order:</label>
                  <select
                    value={localFilters.sortOrder}
                    onChange={(e) => handleLocalFilterChange("sortOrder", e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={onApplyFilters}
                disabled={!filtersChanged}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                  filtersChanged
                    ? "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Check size={18} />
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearchAndFilters;
