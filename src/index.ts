import { serve } from "bun";
import index from "./index.html";
import { authAPI, menuAPI, experimentAPI } from "./api";

// 初始化数据库
import "./db";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    // 认证 API
    "/api/auth/login": {
      async POST(req) {
        const { username, password } = await req.json();
        try {
          const result = authAPI.login(username, password);
          return Response.json(result);
        } catch (e: any) {
          return Response.json({ error: e.message }, { status: 401 });
        }
      },
    },

    "/api/auth/register": {
      async POST(req) {
        const { username, password, name } = await req.json();
        try {
          const result = authAPI.register(username, password, name);
          return Response.json(result);
        } catch (e: any) {
          return Response.json({ error: e.message }, { status: 400 });
        }
      },
    },

    // 菜单 API
    "/api/menu": {
      async GET() {
        const menus = menuAPI.getMenus();
        return Response.json(menus);
      },
    },

    "/api/menu/student_experiment": {
      async GET() {
        const experiments = menuAPI.getStudentExperiments();
        return Response.json(experiments);
      },
    },

    "/api/modules": {
      async GET() {
        const modules = menuAPI.getModules();
        return Response.json(modules);
      },
    },

    // 实验记录 API
    "/api/experiment-records": {
      async POST(req) {
        const { userId, experimentId, data, score } = await req.json();
        const result = experimentAPI.saveRecord(userId, experimentId, data, score);
        return Response.json(result);
      },
      async GET(req) {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");
        if (userId) {
          const records = experimentAPI.getRecords(Number(userId));
          return Response.json(records);
        }
        return Response.json({ error: "userId required" }, { status: 400 });
      },
    },

    "/api/experiment-records/:id": {
      async GET(req) {
        const id = Number(req.params.id);
        const record = experimentAPI.getRecord(id);
        return Response.json(record);
      },
    },

    // 健康检查
    "/api/health": {
      async GET() {
        return Response.json({ status: "ok", timestamp: Date.now() });
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
