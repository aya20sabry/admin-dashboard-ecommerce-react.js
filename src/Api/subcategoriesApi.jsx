import axiosInstance from './axiosInstance';
import { unwrap } from './apiUtils';

const resource = '/sub-category';

export const fetchSubcategories = async (categoryId) =>
  unwrap(
    await axiosInstance.get(resource, {
      params: categoryId ? { categoryId } : undefined,
    })
  );

export const fetchSubcategoryById = async (id) => unwrap(await axiosInstance.get(`${resource}/${id}`));

export const createSubcategory = async (payload) => unwrap(await axiosInstance.post(resource, payload));

export const updateSubcategory = async (id, payload) => unwrap(await axiosInstance.patch(`${resource}/${id}`, payload));

export const deleteSubcategory = async (id) => unwrap(await axiosInstance.delete(`${resource}/${id}`));

export const paginateSubcategories = async ({ page = 1, limit = 10, categoryId } = {}) =>
  unwrap(
    await axiosInstance.get(`${resource}/paginate`, {
      params: { page, limit, ...(categoryId ? { categoryId } : {}) },
    })
  );

export const searchSubcategories = async ({ query, page = 1, limit = 10, categoryId } = {}) =>
  unwrap(
    await axiosInstance.get(`${resource}/search`, {
      params: { query, page, limit, ...(categoryId ? { categoryId } : {}) },
    })
  );

export default {
  fetchSubcategories,
  fetchSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  paginateSubcategories,
  searchSubcategories,
};


