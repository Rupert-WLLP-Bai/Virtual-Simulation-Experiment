import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/auth";

export default function HomePage() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onLogout={logout} />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">欢迎使用 VSE 虚拟仿真实验系统</h1>
          <p className="text-gray-600">请从左侧选择实验开始学习</p>
        </div>
      </main>
    </div>
  );
}
