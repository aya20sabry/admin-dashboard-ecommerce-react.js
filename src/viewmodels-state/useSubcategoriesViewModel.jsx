import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories } from "../Api/categoriesApi";
import {
  paginateSubcategories,
  searchSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../Api/subcategoriesApi";

export const useSubcategoriesViewModel = () => {
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
  const { data: subsData, isLoading } = useQuery({
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
  const categories = categoriesData ?? [];

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
    categories,
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


