import { AxiosInstance } from "axios";
// import { useAuthStore } from "../../store/auth";
// import { useAuthStore } from '@/stores/auth'; // 或从context获取

export const setupInterceptors = (instance: AxiosInstance) => {
  // 请求拦截
  instance.interceptors.request.use(async (config) => {
    const { useAuthStore } = await import("../../store/useAuthStore");
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // // 响应拦截
  // instance.interceptors.response.use(
  //   (response) => response.data,
  //   (error) => {
  //     if (error.response?.status === 401) {
  //       useAuthStore.getState().logout();
  //       // window.location.href = "/login";
  //     }
  //     return Promise.reject(error);
  //   }
  // );
};
