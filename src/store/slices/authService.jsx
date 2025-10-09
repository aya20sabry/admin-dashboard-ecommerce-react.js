import axiosInstance from '../../Api/axiosInstance';

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post('/user/login', credentials);
  return data;
};
