import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login";
import HomePage from "@/pages/home";
import ExperimentPage from "@/pages/experiment";

// 实验组件映射
const experimentComponents: Record<string, React.ComponentType> = {
  // exp1
  "1-cosmic": () => import("@/pages/exp1/cosmic"),
  "1-markii": () => import("@/pages/exp1/markii"),
  "1-singlescheme": () => import("@/pages/exp1/singlescheme"),
  "1-gb11": () => import("@/pages/exp1/gb11"),
  "1-ifpug": () => import("@/pages/exp1/ifpug"),
  "1-nesma": () => import("@/pages/exp1/nesma"),
  // exp2
  "2-gb21": () => import("@/pages/exp2/gb21"),
  "2-leibi": () => import("@/pages/exp2/leibi"),
  "2-leitui": () => import("@/pages/exp2/leitui"),
  "2-minjie": () => import("@/pages/exp2/minjie"),
  "2-xinxihuapinggu": () => import("@/pages/exp2/xinxihuapinggu"),
  // exp3
  "3-gb31": () => import("@/pages/exp3/gb31"),
  // exp4
  "4-gb41": () => import("@/pages/exp4/gb41"),
  "4-testcost": () => import("@/pages/exp4/testcost"),
  // exp6
  "6-tanpaifang": () => import("@/pages/exp6/tanpaifang"),
  // exp7
  "7-jinxianzhi": () => import("@/pages/exp7/jinxianzhi"),
  "7-yinkuipingheng": () => import("@/pages/exp7/yinkuipingheng"),
  "7-dongtaitouzi": () => import("@/pages/exp7/dongtaitouzi"),
  "7-chongzhiqi": () => import("@/pages/exp7/chongzhiqi"),
  "7-shengmingzhouqi": () => import("@/pages/exp7/shengmingzhouqi"),
  // exp8
  "8-minganxing": () => import("@/pages/exp8/minganxing"),
  "8-boyi": () => import("@/pages/exp8/boyi"),
  "8-qiwangjingxianzhi": () => import("@/pages/exp8/qiwangjingxianzhi"),
  // exp9
  "9-buqueding": () => import("@/pages/exp9/buqueding"),
  // exp10
  "10-decisiontree": () => import("@/pages/exp10/decisiontree"),
  "10-jianhuajisuan": () => import("@/pages/exp10/jianhuajisuan"),
  "10-yingli": () => import("@/pages/exp10/yingli"),
  "10-changzhai": () => import("@/pages/exp10/changzhai"),
  "10-shengcun": () => import("@/pages/exp10/shengcun"),
  // exp11
  "11-fenxiyupingjia": () => import("@/pages/exp11/fenxiyupingjia"),
  // exp12
  "12-xiaoyi": () => import("@/pages/exp12/xiaoyi"),
  // exp13
  "13-xiaoguo": () => import("@/pages/exp13/xiaoguo"),
  // exp14
  "14-eva": () => import("@/pages/exp14/eva"),
  // exp47
  "47-montecarlo": () => import("@/pages/exp47/montecarlo"),
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/exp/:module/:experiment",
    element: <ExperimentPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

export { router, experimentComponents };
