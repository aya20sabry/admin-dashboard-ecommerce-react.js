import React from "react";
import { Plus, X, Search } from "lucide-react";
import ResizableTable from "../../components/common/ResizableTable";
import Pagination from "../../components/common/Pagination";
import { useSubcategoriesViewModel } from "../../viewmodels-state/useSubcategoriesViewModel";

export default function Subcategories() {
  const {
    page,
    limit,
    query,
    form,
    editingId,
    error,
    items,
    total,
    categories,
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
  } = useSubcategoriesViewModel();

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

  // Define table columns
  const columns = [
    {
      key: "name.en",
      title: "Name (EN)",
      render: (value, item) => (
        <div className="text-sm font-medium text-gray-900">
          {item?.name?.en || "-"}
        </div>
      ),
    },
    {
      key: "name.ar",
      title: "Name (AR)",
      render: (value, item) => (
        <div className="text-sm text-gray-600" dir="rtl">
          {item?.name?.ar || "-"}
        </div>
      ),
    },
    {
      key: "categoryId",
      title: "Category",
      render: (value, item) => (
        <div className="text-sm text-gray-700">
          {item?.categoryId?.name?.en || item?.categoryId?.name || "-"}
        </div>
      ),
    },
    {
      key: "description",
      title: "Description",
      render: (value, item) => (
        <div className="text-sm text-gray-500 max-w-xs truncate">
          {item?.description?.en || item?.description?.ar || "-"}
        </div>
      ),
    },
  ];

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Subcategories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage product subcategories
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors min-h-touch tap-highlight-transparent touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Add new subcategory"
        >
          <Plus size={20} aria-hidden="true" />
          <span className="hidden xs:inline">Add Subcategory</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      {/* Search Section */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search subcategories..."
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation bg-white"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            aria-label="Search subcategories"
          />
        </div>
      </div>

      {/* ResizableTable Component */}
      <ResizableTable
        data={items}
        columns={columns}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={(item) => onDelete(item._id)}
        emptyMessage="No subcategories found"
        emptyIcon="📁"
        rowKey="_id"
        tableId="subcategories-table"
      />

      {/* Pagination Component */}
      {items.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={limit}
          onPageChange={setPage}
          onItemsPerPageChange={setLimit}
          itemsLabel="subcategories"
        />
      )}

      {/* Create/Edit Form Modal */}
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
                {editingId ? "Edit Subcategory" : "Create New Subcategory"}
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
              {/* Category Selection */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent tap-highlight-transparent touch-manipulation"
                  value={form.categoryId}
                  onChange={(e) => updateField("categoryId", e.target.value)}
                  aria-required="true"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c?.name?.en} / {c?.name?.ar}
                    </option>
                  ))}
                </select>
              </div>

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
                    placeholder="Enter subcategory name"
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
                    placeholder="Enter subcategory description"
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
                    placeholder="أدخل اسم الفئة الفرعية"
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
                    placeholder="أدخل وصف الفئة الفرعية"
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
                    <>
                      {editingId ? "Update Subcategory" : "Create Subcategory"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
