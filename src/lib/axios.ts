import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/auth.store';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore.getState();
    const originalRequest = error.config;

    const status = error.response?.status;
    const message = error.response?.data?.message;

    // ❌ Nếu không phải 401 → reject luôn
    if (status !== 401) return Promise.reject(error);

    // ⚠️ Nếu chưa có token (user chưa login) → logout + redirect
    const hasToken = !!authStore.accessToken;
    if (!hasToken) {
      authStore.logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // ⚠️ Nếu là lỗi 401 nhưng không phải TOKEN_EXPIRED → logout
    if (message !== 'TOKEN_EXPIRED' && message !== 'jwt expired') {
      authStore.logout();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // 🌀 Nếu token hết hạn và chưa retry thì refresh
    if (originalRequest._retry) return Promise.reject(error);
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      if (!authStore.refreshToken) throw new Error('Missing refresh token');

      const res = await authService.refreshToken(authStore.refreshToken);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res;

      // Cập nhật store & localStorage
      authStore.setAuth(newAccessToken, newRefreshToken, authStore.user);

      refreshQueue.forEach((cb) => cb(newAccessToken));
      refreshQueue = [];

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (err) {
      authStore.logout();
      window.location.href = '/login';
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
