import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '../stores/useUserStore';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000') + '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    const token = useUserStore.getState().token;
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isRefreshRequest = (error.config as AxiosRequestConfig)?.url?.includes('/users/refresh');

    // refresh 요청 자체 401 → 무한루프 방지
    if (error.response?.status === 401 && isRefreshRequest) {
      useUserStore.getState().clearUser();
      return Promise.reject(error);
    }

    // 일반 401 → access token 만료 → refresh 시도
    if (error.response?.status === 401) {
      return api
        .post('/users/refresh')
        .then((res) => {
          const newToken: string = res.data.accessToken;
          useUserStore.getState().setUser(useUserStore.getState().user!, newToken);
          error.config.headers['Authorization'] = 'Bearer ' + newToken;
          return api.request(error.config);
        })
        .catch(() => {
          useUserStore.getState().clearUser();
          return Promise.reject(error);
        });
    }

    return Promise.reject(error);
  }
);

export default api;
