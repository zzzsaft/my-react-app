import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthService } from "../api/services/auth.service";
import { log } from "console";
import { message } from "antd";
import { Position } from "../types/types";

interface User {
  id: string;
  name: string;
}

interface AuthState {
  location: null | Position;
  token: string | null;
  name: string | null;
  avatar: string | null;
  userid: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<boolean>;
  loginWithCode: (code: string) => Promise<void>;
  logout: () => void;
  setLocation: (loc: Position) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    // 持久化中间件（可选）
    (set, get) => ({
      location: null,
      token: null,
      name: null,
      avatar: null,
      userid: null,
      isAuthenticated: false,
      isLoading: false,

      // 新增：检查当前认证状态
      checkAuth: async () => {
        const { token, isAuthenticated } = get();
        if (!token) return false;
        if (get().isLoading) return false; // 防止重复执行
        try {
          set({ isLoading: true });
          // 验证token有效性
          const user = await AuthService.getUserInfo();
          set({
            userid: user.userId,
            isAuthenticated: true,
            name: user.name,
            avatar: user.avatar,
          });
          if (user.token) {
            set({ token: user.token });
          }
          return true;
        } catch (error) {
          set({ token: null, userid: null, isAuthenticated: false });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithCode: async (code: string) => {
        if (get().isLoading) return; // 防止重复执行
        set({ isLoading: true });
        try {
          const { token } = await AuthService.loginWithCode(code);
          set({ token });
          const user = await AuthService.getUserInfo();
          set({
            userid: user.userId,
            isAuthenticated: true,
            name: user.name,
            avatar: user.avatar,
          });
        } catch {
          set({ userid: null, isAuthenticated: false });
          throw new Error("登录失败");
        } finally {
          set({ isLoading: false });
        }
      },
      // 新增：退出登录
      logout: () => {
        set({
          token: null,
          name: null,
          avatar: null,
          userid: null,
          isAuthenticated: false,
        });
      },
      setLocation: async (location: Position) => {
        set({ location: location });
        await AuthService.setLocation(location);
      },
    }),
    {
      name: "auth-storage", // localStorage 的 key
      partialize: (state) => ({ token: state.token, name: state.name }), // 只持久化 token
    }
  )
);
