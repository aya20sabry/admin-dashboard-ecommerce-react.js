// src/models/category.model.jsx

/**
 * Category Model - Transforms backend category data to frontend-friendly format
 *
 * Handles:
 * - Keeps original nested structure for backward compatibility
 * - Adds computed properties for convenience
 * - Safe defaults for missing data
 */

export const createCategory = (category) => {
  if (!category) {
    return {
      _id: "",
      id: "",
      name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      displayName: "Unknown Category",
      fullDisplay: "Unknown Category",
      hasDescription: false,
      createdAt: null,
      updatedAt: null,
    };
  }

  return {
    // Keep original structure
    _id: category._id || category.id || "",
    id: category._id || category.id || "",

    // Keep nested name (original structure)
    name: {
      en: category.name?.en || "",
      ar: category.name?.ar || "",
    },

    // Keep nested description (original structure)
    description: {
      en: category.description?.en || "",
      ar: category.description?.ar || "",
    },

    // Computed: Display name with fallback
    displayName: category.name?.en || category.name?.ar || "Unnamed Category",

    // Computed: Check if has description
    hasDescription: !!(category.description?.en || category.description?.ar),

    // Computed: Full bilingual display
    fullDisplay: category.name?.en
      ? category.name?.ar
        ? `${category.name.en} / ${category.name.ar}`
        : category.name.en
      : category.name?.ar || "Unnamed",

    // Timestamps
    createdAt: category.createdAt || null,
    updatedAt: category.updatedAt || null,
  };
};

/**
 * Transform array of categories
 */
export const createCategories = (categories) => {
  if (!Array.isArray(categories)) {
    return [];
  }
  return categories.map(createCategory);
};

/**
 * Create empty category (for forms)
 */
export const createEmptyCategory = () => ({
  _id: "",
  id: "",
  name: { en: "", ar: "" },
  description: { en: "", ar: "" },
  displayName: "",
  fullDisplay: "",
  hasDescription: false,
  createdAt: null,
  updatedAt: null,
});

export default {
  createCategory,
  createCategories,
  createEmptyCategory,
};
