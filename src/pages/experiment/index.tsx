import { useParams, useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/auth";

// 使用 React.lazy 懒加载实验组件
const experiments: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  cosmic: lazy(() => import("@/pages/exp1/cosmic/index.tsx")),
  markii: lazy(() => import("@/pages/exp1/markii/index.tsx")),
  singlescheme: lazy(() => import("@/pages/exp1/singlescheme/index.tsx")),
  gb11: lazy(() => import("@/pages/exp1/gb11/index.tsx")),
  ifpug: lazy(() => import("@/pages/exp1/ifpug/index.tsx")),
  nesma: lazy(() => import("@/pages/exp1/nesma/index.tsx")),
  gb21: lazy(() => import("@/pages/exp2/gb21/index.tsx")),
  leibi: lazy(() => import("@/pages/exp2/leibi/index.tsx")),
  leitui: lazy(() => import("@/pages/exp2/leitui/index.tsx")),
  minjie: lazy(() => import("@/pages/exp2/minjie/index.tsx")),
  gb31: lazy(() => import("@/pages/exp3/gb31/index.tsx")),
  gb41: lazy(() => import("@/pages/exp4/gb41/index.tsx")),
  xinxihuapinggu: lazy(() => import("@/pages/exp2/xinxihuapinggu/index.tsx")),
  tanpaifang: lazy(() => import("@/pages/exp6/tanpaifang/index.tsx")),
  jinxianzhi: lazy(() => import("@/pages/exp7/jinxianzhi/index.tsx")),
  yinkuipingheng: lazy(() => import("@/pages/exp7/yinkuipingheng/index.tsx")),
  dongtaitouzi: lazy(() => import("@/pages/exp7/dongtaitouzi/index.tsx")),
  chongzhiqi: lazy(() => import("@/pages/exp7/chongzhiqi/index.tsx")),
  shengmingzhouqi: lazy(() => import("@/pages/exp7/shengmingzhouqi/index.tsx")),
  minganxing: lazy(() => import("@/pages/exp8/minganxing/index.tsx")),
  boyi: lazy(() => import("@/pages/exp8/boyi/index.tsx")),
  qiwangjingxianzhi: lazy(() => import("@/pages/exp8/qiwangjingxianzhi/index.tsx")),
  buqueding: lazy(() => import("@/pages/exp9/buqueding/index.tsx")),
  testcost: lazy(() => import("@/pages/exp4/testcost/index.tsx")),
  decisiontree: lazy(() => import("@/pages/exp10/decisiontree/index.tsx")),
  jianhuajisuan: lazy(() => import("@/pages/exp10/jianhuajisuan/index.tsx")),
  yingli: lazy(() => import("@/pages/exp10/yingli/index.tsx")),
  changzhai: lazy(() => import("@/pages/exp10/changzhai/index.tsx")),
  shengcun: lazy(() => import("@/pages/exp10/shengcun/index.tsx")),
  fenxiyupingjia: lazy(() => import("@/pages/exp11/fenxiyupingjia/index.tsx")),
  xiaoyi: lazy(() => import("@/pages/exp12/xiaoyi/index.tsx")),
  xiaoguo: lazy(() => import("@/pages/exp13/xiaoguo/index.tsx")),
  eva: lazy(() => import("@/pages/exp14/eva/index.tsx")),
  montecarlo: lazy(() => import("@/pages/exp47/montecarlo/index.tsx")),
};

function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
        <p className="text-gray-600">加载中...</p>
      </div>
    </div>
  );
}

export default function ExperimentPage() {
  const { experiment } = useParams();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const key = experiment?.toLowerCase() || "";
  const ExperimentComponent = experiments[key];

  return (
    <div className="flex min-h-screen w-screen overflow-hidden bg-gray-100">
      <Sidebar onLogout={logout} />
      <main className="flex-1 min-w-0 p-6 overflow-auto m-0">
        {ExperimentComponent !== undefined ? (
          <Suspense fallback={<Loading />}>
            <ExperimentComponent />
          </Suspense>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-300 mb-4">404</h2>
                <p className="text-gray-600 mb-4">未找到实验: {experiment}</p>
                <button
                  onClick={() => navigate("/home")}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  返回首页
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
