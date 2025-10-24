import axiosInstance from "./axiosInstance";
import { unwrap } from "./apiUtils";
import {
  createSubcategory as transformSubcategory,
  createSubcategories as transformSubcategories,
} from "../models/subcategory.model";

const resource = "/sub-category";

export const fetchSubcategories = async (categoryId) => {
  const data = unwrap(
    await axiosInstance.get(resource, {
      params: categoryId ? { categoryId } : undefined,
    }),
  );
  return transformSubcategories(data);
};

export const fetchSubcategoryById = async (id) => {
  const data = unwrap(await axiosInstance.get(`${resource}/${id}`));
  return transformSubcategory(data);
};

export const createSubcategory = async (payload) =>
  unwrap(await axiosInstance.post(resource, payload));

export const updateSubcategory = async (id, payload) =>
  unwrap(await axiosInstance.patch(`${resource}/${id}`, payload));

export const deleteSubcategory = async (id) =>
  unwrap(await axiosInstance.delete(`${resource}/${id}`));

export const paginateSubcategories = async ({
  page = 1,
  limit = 10,
  categoryId,
} = {}) => {
  const data = unwrap(
    await axiosInstance.get(`${resource}/paginate`, {
      params: { page, limit, ...(categoryId ? { categoryId } : {}) },
    }),
  );
  return {
    items: transformSubcategories(data.items),
    total: data.total,
  };
};

export const searchSubcategories = async ({
  query,
  page = 1,
  limit = 10,
  categoryId,
} = {}) => {
  const data = unwrap(
    await axiosInstance.get(`${resource}/search`, {
      params: { query, page, limit, ...(categoryId ? { categoryId } : {}) },
    }),
  );
  return {
    items: transformSubcategories(data.items),
    total: data.total,
  };
};

export default {
  fetchSubcategories,
  fetchSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  paginateSubcategories,
  searchSubcategories,
};
