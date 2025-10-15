// src/services/auth.service.js
import axiosInstance from "./axiosInstance";
import { createUser } from "../models/user.model";

export const loginApi = async (email, password) => {
  const response = await axiosInstance.post("/user/login", { email, password });
  const { token, userName, email: userEmail, role } = response.data.data;

  return createUser({ userName, email: userEmail, role, token });
};
