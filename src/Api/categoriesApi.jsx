import axiosInstance from './axiosInstance';
import { unwrap } from './apiUtils';

const resource = '/categories';

export const fetchCategories = async () => unwrap(await axiosInstance.get(resource));

export const fetchCategoryById = async (id) => unwrap(await axiosInstance.get(`${resource}/${id}`));

export const createCategory = async (payload) => unwrap(await axiosInstance.post(resource, payload));

export const updateCategory = async (id, payload) => unwrap(await axiosInstance.patch(`${resource}/${id}`, payload));

export const deleteCategory = async (id) => unwrap(await axiosInstance.delete(`${resource}/${id}`));

export const paginateCategories = async ({ page = 1, limit = 10 } = {}) =>
  unwrap(
    await axiosInstance.get(`${resource}/paginate`, {
      params: { page, limit },
    })
  );

export const searchCategories = async ({ query, page = 1, limit = 10 } = {}) =>
  unwrap(
    await axiosInstance.get(`${resource}/search`, {
      params: { query, page, limit },
    })
  );

export const countCategories = async () => unwrap(await axiosInstance.get(`${resource}/count`));





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





