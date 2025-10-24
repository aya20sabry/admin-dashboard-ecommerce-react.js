// src/models/subcategory.model.jsx

/**
 * Subcategory Model - Transforms backend subcategory data to frontend-friendly format
 *
 * Handles:
 * - Keeps original nested structure for backward compatibility
 * - Adds computed properties for convenience
 * - Category relationship (string ID or populated object)
 * - Safe defaults for missing data
 */

export const createSubcategory = (subcategory) => {
  if (!subcategory) {
    return {
      _id: "",
      id: "",
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      categoryId: "",
      displayName: "Unknown Subcategory",
      fullDisplay: "Unknown Subcategory",
      hasDescription: false,
      hasCategory: false,
      categoryName: "",
      categoryNameAr: "",
      categoryFullDisplay: "",
      createdAt: null,
      updatedAt: null,
    };
  }

  // Handle categoryId: can be string or populated object
  const categoryId =
    typeof subcategory.categoryId === "string"
      ? subcategory.categoryId
      : subcategory.categoryId?._id || "";

  const categoryName =
    typeof subcategory.categoryId === "object"
      ? subcategory.categoryId?.name?.en || ""
      : "";

  const categoryNameAr =
    typeof subcategory.categoryId === "object"
      ? subcategory.categoryId?.name?.ar || ""
      : "";

  return {
    // Keep original structure
    _id: subcategory._id || subcategory.id || "",
    id: subcategory._id || subcategory.id || "",

    // Keep nested name (original structure)
    name: {
      en: subcategory.name?.en || "",
      ar: subcategory.name?.ar || "",
    },

    // Keep nested description (original structure)
    description: {
      en: subcategory.description?.en || "",
      ar: subcategory.description?.ar || "",
    },

    // Category relationship (keep original if populated, or just ID)
    categoryId:
      typeof subcategory.categoryId === "object"
        ? subcategory.categoryId
        : categoryId,

    // Computed: Display name with fallback
    displayName:
      subcategory.name?.en || subcategory.name?.ar || "Unnamed Subcategory",

    // Computed: Check if has description
    hasDescription: !!(
      subcategory.description?.en || subcategory.description?.ar
    ),

    // Computed: Check if has category
    hasCategory: !!categoryId,

    // Computed: Full bilingual display
    fullDisplay: subcategory.name?.en
      ? subcategory.name?.ar
        ? `${subcategory.name.en} / ${subcategory.name.ar}`
        : subcategory.name.en
      : subcategory.name?.ar || "Unnamed",

    // Computed: Category name (extracted if populated)
    categoryName: categoryName,
    categoryNameAr: categoryNameAr,

    // Computed: Category full display (if populated)
    categoryFullDisplay: categoryName
      ? categoryNameAr
        ? `${categoryName} / ${categoryNameAr}`
        : categoryName
      : categoryNameAr || "",

    // Timestamps
    createdAt: subcategory.createdAt || null,
    updatedAt: subcategory.updatedAt || null,
  };
};

/**
 * Transform array of subcategories
 */
export const createSubcategories = (subcategories) => {
  if (!Array.isArray(subcategories)) {
    return [];
  }
  return subcategories.map(createSubcategory);
};

/**
 * Create empty subcategory (for forms)
 */
export const createEmptySubcategory = () => ({
  _id: "",
  id: "",
  name: { en: "", ar: "" },
  description: { en: "", ar: "" },
  categoryId: "",
  displayName: "",
  fullDisplay: "",
  hasDescription: false,
  hasCategory: false,
  categoryName: "",
  categoryNameAr: "",
  categoryFullDisplay: "",
  createdAt: null,
  updatedAt: null,
});

export default {
  createSubcategory,
  createSubcategories,
  createEmptySubcategory,
};
