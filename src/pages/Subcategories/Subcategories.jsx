import React from "react";
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subcategories</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">

        {/* <label className="text-sm text-gray-600">Filter by Category</label>
        <select
          className="border rounded-md p-2"
          value={selectedCategoryId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedCategoryId(id);
            setPage(1);
          }}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c?.name?.en} / {c?.name?.ar}
            </option>
          ))}
        </select> */}

        <input
          type="text"
          placeholder="Search by name..."
          className="border rounded-md p-2"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border rounded-md p-2"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-xl border">
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Category</label>
          <select
            required
            className="w-full border rounded-md p-2"
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
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
        <div>
          <label className="block text-sm text-gray-600 mb-1">Name (EN)</label>
          <input
            type="text"
            value={form.name.en}
            onChange={(e) => updateField("name.en", e.target.value)}
            required
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Name (AR)</label>
          <input
            type="text"
            value={form.name.ar}
            onChange={(e) => updateField("name.ar", e.target.value)}
            required
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Description (EN)</label>
          <input
            type="text"
            value={form.description.en}
            onChange={(e) => updateField("description.en", e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Description (AR)</label>
          <input
            type="text"
            value={form.description.ar}
            onChange={(e) => updateField("description.ar", e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-100 rounded-md"
            >
              Cancel
            </button>
          )}
          {error && <span className="text-red-600 self-center">{error}</span>}
        </div>
      </form>

      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b font-medium">All Subcategories</div>
        <div className="divide-y">
          {isLoading && items.length === 0 ? (
            <div className="p-4 text-gray-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-4 text-gray-500">No subcategories</div>
          ) : (
            items.map((s) => (
              <div key={s._id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">
                    {s?.categoryId?.name?.en || s?.categoryId?.name} {/* populated or id-only */}
                  </div>
                  <div className="font-semibold">{s?.name?.en} / {s?.name?.ar}</div>
                  {(s?.description?.en || s?.description?.ar) && (
                    <div className="text-sm text-gray-600">
                      {s?.description?.en} {s?.description?.ar ? ` / ${s?.description?.ar}` : ""}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(s)}
                    className="px-3 py-1.5 text-sm bg-amber-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(s._id)}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 flex items-center justify-between">
          <button
            className="px-3 py-1.5 rounded-md border"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <div className="text-sm text-gray-600">
            Page {page} • Total {total}
          </div>
          <button
            className="px-3 py-1.5 rounded-md border"
            disabled={items.length < limit && (query ? true : page * limit >= total)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}


