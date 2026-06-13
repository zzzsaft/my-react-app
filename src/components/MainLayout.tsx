import React, { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Dropdown } from "@/components/ui/core";
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@/components/ui/icons";
import type { MenuProps } from "@/components/ui/core";
import { useAuthStore } from "../store/useAuthStore";
import { GlobalModal } from "./GlobalModal";

type NavItem = {
  key: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
};

const navItems: NavItem[] = [
  { key: "/", label: "首页", description: "工作台概览", icon: <HomeOutlined /> },
  { key: "/quote/history", label: "历史报价单", description: "查看与检索报价记录" },
  { key: "/quote/oa", label: "OA 报价单", description: "同步 OA 流程单据" },
  { key: "/quote/todo", label: "待办任务", description: "处理待提交与待审批" },
  { key: "/template", label: "模板管理", description: "维护报价模板配置" },
  { key: "/quote-agent", label: "文档审核", description: "按文档逐条审核字典候选" },
  { key: "/quote-agent/clusters", label: "候选簇审核", description: "按候选簇批量治理字典候选" },
  { key: "/quote-agent/dictionary", label: "字典管理", description: "维护 termType 与 alias 属性" },
];

const MainLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const name = useAuthStore.getState().name || "用户";
  const avatar = useAuthStore.getState().avatar;

  const activeKey = useMemo(() => {
    return (
      navItems
        .filter((item) => item.key === "/" ? location.pathname === "/" : location.pathname.startsWith(item.key))
        .sort((a, b) => b.key.length - a.key.length)[0]?.key || "/"
    );
  }, [location.pathname]);

  const userDropdownItems: MenuProps["items"] = [
    {
      key: "settings",
      label: "系统设置",
      icon: <SettingOutlined />,
    },
  ];

  const handleNavigate = (key: string) => {
    navigate(key);
    setMenuOpen(false);
  };

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-line bg-app-panel">
      <div className="flex h-16 items-center gap-3 border-b border-line-subtle px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-sm font-semibold text-white">
          JDY
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">报价管理</div>
          <div className="truncate text-xs text-slate-500">业务菜单</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const active = item.key === activeKey;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNavigate(item.key)}
              className={[
                "group flex w-full items-center gap-3 rounded-md border px-3 py-3 text-left transition",
                "focus:outline-none focus:ring-2 focus:ring-brand-200",
                active
                  ? "border-brand-100 bg-brand-50 text-brand-700 shadow-sm"
                  : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold",
                  active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white",
                ].join(" ")}
              >
                {item.icon || item.label.slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{item.label}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">{item.description}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen bg-app-bg text-text-primary">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block">{sidebar}</div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="关闭菜单"
            className="absolute inset-0 z-0 h-full w-full bg-slate-950/35"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative z-10 h-full w-64 shadow-xl">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-app-panel/95 px-4 shadow-sm backdrop-blur">
          <button
            type="button"
            aria-label={menuOpen ? "收起菜单" : "展开菜单"}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200 lg:hidden"
          >
            {menuOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </button>

          <div className="hidden min-w-0 lg:block">
            <div className="text-sm font-semibold text-slate-900">
              {navItems.find((item) => item.key === activeKey)?.label || "首页"}
            </div>
            <div className="text-xs text-slate-500">
              {navItems.find((item) => item.key === activeKey)?.description || "工作台概览"}
            </div>
          </div>

          <Dropdown menu={{ items: userDropdownItems }} trigger={["click"]}>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <Avatar size="small" icon={<UserOutlined />} src={avatar} />
              <span className="hidden max-w-32 truncate sm:inline">{name}</span>
            </button>
          </Dropdown>
        </header>

        <main className="min-h-[calc(100vh-56px)] p-3 sm:p-4">
          <div className="min-h-[calc(100vh-88px)] rounded-md border border-line bg-app-panel p-4 shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>

      <GlobalModal />
    </div>
  );
};

export default MainLayout;
