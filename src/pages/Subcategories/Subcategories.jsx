import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories } from "../../Api/categoriesApi";
import {
  paginateSubcategories,
  searchSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../../Api/subcategoriesApi";

export default function Subcategories() {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");
  const initialForm = useMemo(
    () => ({
      categoryId: "",
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
    }),
    []
  );
  const [form, setForm] = useState(initialForm);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };
console.log(selectedCategoryId);

  // Load categories for dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ["categories-dropdown"],
    queryFn: async () => {
      const res = await fetchCategories();
      const data = res?.data ?? res;
      return Array.isArray(data) ? data : data?.items ?? [];
    },
  });

  // Load subcategories with pagination/search
  const {
    data: subsData,
    isLoading,
  } = useQuery({
    queryKey: [
      "subcategories",
      { page, limit, categoryId: selectedCategoryId || undefined, query: query || undefined },
    ],
    queryFn: async () => {
      if (query && query.trim()) {
        return await searchSubcategories({
          query: query.trim(),
          page,
          limit,
          categoryId: selectedCategoryId || undefined,
        });
      }
      return await paginateSubcategories({ page, limit, categoryId: selectedCategoryId || undefined });
    },
    keepPreviousData: true,
  });

  const items = subsData?.items ?? [];
  const total = subsData?.total ?? items.length;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      categoryId: form.categoryId,
      name: form.name,
      description: form.description,
    };
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      resetForm();
    } catch (e) {
      setError(e?.response?.data?.message || "Operation failed");
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      categoryId: item?.categoryId?._id || item?.categoryId || "",
      name: { en: item?.name?.en || "", ar: item?.name?.ar || "" },
      description: {
        en: item?.description?.en || "",
        ar: item?.description?.ar || "",
      },
    });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this subcategory?")) return;
    setError("");
    try {
      await deleteMutation.mutateAsync(id);
    } catch (e) {
      setError(e?.response?.data?.message || "Delete failed");
    }
  };

  const updateField = (path, value) => {
    setForm((prev) => {
      const next = { ...prev };
      if (path === "categoryId") next.categoryId = value;
      if (path === "name.en") next.name = { ...prev.name, en: value };
      if (path === "name.ar") next.name = { ...prev.name, ar: value };
      if (path === "description.en")
        next.description = { ...prev.description, en: value };
      if (path === "description.ar")
        next.description = { ...prev.description, ar: value };
      return next;
    });
  };

  // Mutations with invalidation
  const createMutation = useMutation({
    mutationFn: (payload) => createSubcategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateSubcategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSubcategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });

  const categories = categoriesData ?? [];

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
            disabled={createMutation.isPending || updateMutation.isPending}
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


