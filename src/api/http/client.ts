import axios from "axios";
import { setupInterceptors } from "./interceptors";

const createClient = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  setupInterceptors(instance); // 注入拦截器
  return instance;
};

// 创建不同环境的客户端
export const apiClient =
  process.env.NODE_ENV === "development"
    ? createClient("http://localhost:2001")
    : createClient(import.meta.env.VITE_API_BASE_URL);
// export const qywxClient = createClient(import.meta.env.VITE_QYWX_API_URL);
