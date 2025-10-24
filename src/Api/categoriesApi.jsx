import axiosInstance from "./axiosInstance";
import { unwrap } from "./apiUtils";
import {
  createCategory as transformCategory,
  createCategories as transformCategories,
} from "../models/category.model";

const resource = "/categories";

export const fetchCategories = async () => {
  const data = unwrap(await axiosInstance.get(resource));
  return transformCategories(data);
};

export const fetchCategoryById = async (id) => {
  const data = unwrap(await axiosInstance.get(`${resource}/${id}`));
  return transformCategory(data);
};

export const createCategory = async (payload) =>
  unwrap(await axiosInstance.post(resource, payload));

export const updateCategory = async (id, payload) =>
  unwrap(await axiosInstance.patch(`${resource}/${id}`, payload));

export const deleteCategory = async (id) =>
  unwrap(await axiosInstance.delete(`${resource}/${id}`));

export const paginateCategories = async ({ page = 1, limit = 10 } = {}) => {
  const data = unwrap(
    await axiosInstance.get(`${resource}/paginate`, {
      params: { page, limit },
    }),
  );
  return {
    items: transformCategories(data.items),
    total: data.total,
  };
};

export const searchCategories = async ({
  query,
  page = 1,
  limit = 10,
} = {}) => {
  const data = unwrap(
    await axiosInstance.get(`${resource}/search`, {
      params: { query, page, limit },
    }),
  );
  return {
    items: transformCategories(data.items),
    total: data.total,
  };
};

export const countCategories = async () =>
  unwrap(await axiosInstance.get(`${resource}/count`));

export default {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  paginateCategories,
  searchCategories,
  countCategories,
};
