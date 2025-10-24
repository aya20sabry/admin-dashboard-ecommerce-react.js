// src/pages/Categories/Categories.jsx
import React from "react";
import { useCategoriesViewModel } from "../../viewmodels-state/useCategoriesViewModel";
import { Search, Edit2, Trash2, Plus, X, Filter } from "lucide-react";

export default function Categories() {
  const {
    page,
    limit,
    query,
    form,
    editingId,
    error,
    items,
    total,
    isLoading,
    isCreating,
    isUpdating,
    setPage,
    setLimit,
    setQuery,
    updateField,
    resetForm,
    onSubmit,
    onEdit,
    onDelete,
  } = useCategoriesViewModel();

  const [showForm, setShowForm] = React.useState(false);

  const handleEdit = (item) => {
    onEdit(item);
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const handleSubmitWrapper = async (e) => {
    await onSubmit(e);
    if (!error) {
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen space-y-4 sm:space-y-6">
      {/* Header Section - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage product categories
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Add new category"
        >
          <Plus size={20} aria-hidden="true" />
          <span className="hidden xs:inline">Add Category</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      {/* Search & Filter Section - Mobile First */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search categories..."
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation bg-white"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            aria-label="Search categories"
          />
        </div>

        {/* Items Per Page Selector */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="limit-select"
            className="text-sm text-gray-600 whitespace-nowrap hidden sm:block"
          >
            Show:
          </label>
          <select
            id="limit-select"
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tap-highlight-transparent touch-manipulation bg-white min-w-[80px]"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            aria-label="Items per page"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Create/Edit Form - Mobile Optimized Modal/Card */}
      {showForm && (
        <div className="fixed inset-0 z-modal bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="bg-white w-full sm:max-w-2xl sm:rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
          >
            {/* Form Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
              <h2
                id="form-title"
                className="text-lg sm:text-xl font-semibold text-gray-900"
              >
                {editingId ? "Edit Category" : "Create New Category"}
              </h2>
              <button
                onClick={handleCancel}
                className="inline-flex items-center justify-center min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 tap-highlight-transparent touch-manipulation"
                aria-label="Close form"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSubmitWrapper}
              className="p-4 sm:p-6 space-y-4 sm:space-y-5"
            >
              {/* English Fields */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  English Content
                </h3>
                <div>
                  <label
                    htmlFor="name-en"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name-en"
                    type="text"
                    value={form.name.en}
                    onChange={(e) => updateField("name.en", e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                    placeholder="Enter category name"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description-en"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description (English)
                  </label>
                  <textarea
                    id="description-en"
                    value={form.description.en}
                    onChange={(e) =>
                      updateField("description.en", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation resize-none"
                    placeholder="Enter category description"
                    rows="3"
                  />
                </div>
              </div>

              {/* Arabic Fields */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Arabic Content
                </h3>
                <div>
                  <label
                    htmlFor="name-ar"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name (Arabic) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name-ar"
                    type="text"
                    value={form.name.ar}
                    onChange={(e) => updateField("name.ar", e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                    placeholder="أدخل اسم الفئة"
                    dir="rtl"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description-ar"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description (Arabic)
                  </label>
                  <textarea
                    id="description-ar"
                    value={form.description.ar}
                    onChange={(e) =>
                      updateField("description.ar", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation resize-none"
                    placeholder="أدخل وصف الفئة"
                    rows="3"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isCreating || isUpdating ? (
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
                      {editingId ? "Updating..." : "Creating..."}
                    </span>
                  ) : (
                    <>{editingId ? "Update Category" : "Create Category"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories List - Mobile Optimized Cards/Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* List Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            All Categories
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {total} {total === 1 ? "category" : "categories"} total
          </p>
        </div>

        {/* Loading State */}
        {isLoading && items.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading categories...</p>
          </div>
        ) : items.length === 0 ? (
          // Empty State
          <div className="p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Filter size={32} className="text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 mb-6">
              {query
                ? "Try adjusting your search"
                : "Get started by creating a category"}
            </p>
            {!query && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus size={18} aria-hidden="true" />
                Add Your First Category
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="divide-y divide-gray-200 sm:hidden">
              {items.map((category) => (
                <div key={category._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
                        {category?.name?.en}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {category?.name?.ar}
                      </p>
                      {(category?.description?.en ||
                        category?.description?.ar) && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {category?.description?.en ||
                            category?.description?.ar}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium rounded-lg transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-amber-500"
                      aria-label={`Edit ${category?.name?.en}`}
                    >
                      <Edit2 size={16} aria-hidden="true" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(category._id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Delete ${category?.name?.en}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full" role="table">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Name (EN)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Name (AR)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.map((category) => (
                    <tr
                      key={category._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category?.name?.en}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600" dir="rtl">
                          {category?.name?.ar}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {category?.description?.en ||
                            category?.description?.ar ||
                            "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium rounded-lg transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-amber-500"
                            aria-label={`Edit ${category?.name?.en}`}
                          >
                            <Edit2 size={14} aria-hidden="true" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => onDelete(category._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label={`Delete ${category?.name?.en}`}
                          >
                            <Trash2 size={14} aria-hidden="true" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination - Mobile Optimized */}
        {items.length > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col xs:flex-row items-center justify-between gap-3">
              {/* Page Info */}
              <div className="text-sm text-gray-600 order-2 xs:order-1">
                Page {page} of {Math.ceil(total / limit)}
                <span className="hidden sm:inline"> • {total} total</span>
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2 order-1 xs:order-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-touch min-w-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Previous page"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={
                    items.length < limit &&
                    (query ? true : page * limit >= total)
                  }
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-touch min-w-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
