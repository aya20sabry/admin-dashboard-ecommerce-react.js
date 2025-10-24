import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  paginateCategories,
  searchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../Api/categoriesApi";

export const useCategoriesViewModel = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");

  const initialForm = useMemo(
    () => ({ name: { en: "", ar: "" }, description: { en: "", ar: "" } }),
    []
  );
  const [form, setForm] = useState(initialForm);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["categories", { page, limit, query: query || undefined }],
    queryFn: async () => {
      if (query && query.trim()) {
        return await searchCategories({ query: query.trim(), page, limit });
      }
      return await paginateCategories({ page, limit });
    },
    keepPreviousData: true,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? items.length;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload: form });
      } else {
        await createMutation.mutateAsync(form);
      }
      resetForm();
    } catch (e) {
      setError(e?.response?.data?.message || "Operation failed");
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: { en: item?.name?.en || "", ar: item?.name?.ar || "" },
      description: {
        en: item?.description?.en || "",
        ar: item?.description?.ar || "",
      },
    });
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
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
    mutationFn: (payload) => createCategory(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  return {
    // State
    page,
    limit,
    query,
    form,
    editingId,
    error,
    items,
    total,
    isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Actions
    setPage,
    setLimit,
    setQuery,
    updateField,
    resetForm,
    onSubmit,
    onEdit,
    onDelete,
  };
};


