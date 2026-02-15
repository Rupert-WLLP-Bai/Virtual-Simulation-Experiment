import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  name: string;
  role: "student" | "teacher" | "admin";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// 模拟登录
const mockLogin = async (username: string, password: string): Promise<{ user: User; token: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (username === "admin" && password === "admin123") {
    return {
      user: { id: "1", username: "admin", name: "管理员", role: "admin" },
      token: "mock-token-" + Date.now(),
    };
  }
  if (username === "student" && password === "123456") {
    return {
      user: { id: "2", username: "student", name: "学生", role: "student" },
      token: "mock-token-" + Date.now(),
    };
  }
  throw new Error("用户名或密码错误");
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (username: string, password: string) => {
        const { user, token } = await mockLogin(username, password);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
