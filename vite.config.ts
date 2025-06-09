import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginImp from "vite-plugin-imp"; // 按需加载插件

export default defineConfig({
  optimizeDeps: {
    include: ["antd"],
    // exclude: ["antd/es/auto-complete/style"], // 忽略 auto-complete 样式
  },
  build: {
    // rollupOptions: {
    //   external: [
    //     /antd\/es\/.*\/style/, // 忽略所有 antd 组件样式路径
    //     /antd\/es\/.*\/style\/css/, // 可选的额外忽略
    //   ],
    // },
  },
  plugins: [
    react(),
    // vitePluginImp({
    //   libList: [
    //     {
    //       libName: "antd",
    //       style: (name) => `antd/es/${name}/style`,
    //     },
    //   ],
    // }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // 允许 Less 中使用 JS 表达式
        modifyVars: {
          // Ant Design 主题变量
          "primary-color": "#1890ff", // 全局主色
          "link-color": "#1890ff", // 链接色
          "success-color": "#52c41a", // 成功色
          "warning-color": "#faad14", // 警告色
          "error-color": "#f5222d", // 错误色
          "font-size-base": "14px", // 主字号
          "heading-color": "rgba(0, 0, 0, 0.85)", // 标题色
          "text-color": "rgba(0, 0, 0, 0.65)", // 主文本色
          "text-color-secondary": "rgba(0, 0, 0, 0.45)", // 次文本色
          "disabled-color": "rgba(0, 0, 0, 0.25)", // 失效色
          "border-radius-base": "4px", // 组件/浮层圆角
          "border-color-base": "#d9d9d9", // 边框色
          "box-shadow-base": "0 2px 8px rgba(0, 0, 0, 0.15)", // 浮层阴影

          "background-color-light": "#fafafa",
          "border-color-split": "#f0f0f0",

          // 响应式断点（解决 @screen-sm-max 问题）
          "screen-xs": "480px",
          "screen-sm": "576px",
          "screen-md": "768px",
          "screen-lg": "992px",
          "screen-xl": "1200px",
          "screen-xxl": "1600px",
        },
      },
    },
  },
});
