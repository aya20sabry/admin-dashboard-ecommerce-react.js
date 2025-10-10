export const unwrap = (response) => {
  // Accepts either axios response object or data already
  const data = response?.data ?? response;
  if (data && typeof data === 'object' && 'data' in data && (data.success !== undefined || data.meta !== undefined)) {
    return data.data;
  }
  return data;
};


