import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3030/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: add request/response interceptors (nếu bạn dùng token)
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("accessToken");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Bạn có thể xử lý lỗi toàn cục ở đây (VD: toast, redirect login)
    return Promise.reject(error.response?.data || error);
  },
);

export default api;
