import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Dropdown } from "@/components/ui/core";
import {
  CheckSquareOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  FileSearchOutlined,
  HomeOutlined,
  HistoryOutlined,
  InboxOutlined,
  LayoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  DownOutlined,
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

type NavGroup = {
  key: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
  children: NavItem[];
};

type NavEntry = NavItem | NavGroup;

const isNavGroup = (item: NavEntry): item is NavGroup => "children" in item;

const navEntries: NavEntry[] = [
  { key: "/", label: "首页", description: "工作台概览", icon: <HomeOutlined /> },
  {
    key: "quote",
    label: "报价业务",
    description: "报价单与模板",
    icon: <HistoryOutlined />,
    children: [
      { key: "/quote/history", label: "历史报价单", description: "查看与检索报价记录", icon: <HistoryOutlined /> },
      { key: "/quote/oa", label: "OA 报价单", description: "同步 OA 流程单据", icon: <InboxOutlined /> },
      { key: "/quote/todo", label: "待办任务", description: "处理待提交与待审批", icon: <CheckSquareOutlined /> },
      { key: "/template", label: "模板管理", description: "维护报价模板配置", icon: <LayoutOutlined /> },
    ],
  },
  {
    key: "quote-agent",
    label: "合同归档",
    description: "归档与字典审核",
    icon: <FileSearchOutlined />,
    children: [
      { key: "/quote-agent", label: "合同归档", description: "查看合同归档与版本", icon: <FileSearchOutlined /> },
      { key: "/quote-agent/product-configs", label: "产品配置查询", description: "按产品编号检索归档配置", icon: <DatabaseOutlined /> },
      { key: "/quote-agent/review", label: "文档审核", description: "按文档逐条审核字典候选", icon: <FileSearchOutlined /> },
      { key: "/quote-agent/clusters", label: "候选簇审核", description: "按候选簇批量治理字典候选", icon: <ClusterOutlined /> },
      { key: "/quote-agent/concept-resolver", label: "概念解析审核", description: "审核解析器历史结果", icon: <ClusterOutlined /> },
      { key: "/quote-agent/dictionary", label: "字典管理", description: "维护 termType 与 alias 属性", icon: <DatabaseOutlined /> },
    ],
  },
];

const navItems = navEntries.flatMap((item) => (isNavGroup(item) ? item.children : item));

const MainLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroupKeys, setOpenGroupKeys] = useState<string[]>([]);
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

  useEffect(() => {
    const activeGroup = navEntries.find((item) => isNavGroup(item) && item.children.some((child) => child.key === activeKey));
    if (!activeGroup) return;

    setOpenGroupKeys((keys) => keys.includes(activeGroup.key) ? keys : [...keys, activeGroup.key]);
  }, [activeKey]);

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

  const toggleGroup = (key: string) => {
    setOpenGroupKeys((keys) =>
      keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key],
    );
  };

  const groupHasActiveItem = (group: NavGroup) => group.children.some((item) => item.key === activeKey);

  const renderNavItem = (item: NavItem, nested = false) => {
    const active = item.key === activeKey;

    return (
      <button
        key={item.key}
        type="button"
        onClick={() => handleNavigate(item.key)}
        className={[
          "group relative flex w-full appearance-none items-center gap-3 rounded-md border border-transparent text-left shadow-none transition",
          "focus:outline-none focus:ring-2 focus:ring-brand-200",
          nested ? "min-h-[42px] px-3 py-2 pl-11" : "min-h-[52px] px-3 py-2",
          active
            ? "bg-brand-50 text-brand-700"
            : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        ].join(" ")}
      >
        <span
          className={[
            "absolute inset-y-2 left-0 w-0.5 rounded-r-full transition",
            active ? "bg-brand-600 opacity-100" : "bg-transparent opacity-0",
          ].join(" ")}
        />
        {!nested && (
          <span
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-base transition",
              active ? "bg-brand-600 text-white shadow-sm" : "bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:text-slate-700",
            ].join(" ")}
          >
            {item.icon}
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className={["block truncate font-medium leading-5", nested ? "text-[13px]" : "text-sm", active ? "text-brand-700" : "text-slate-700 group-hover:text-slate-950"].join(" ")}>
            {item.label}
          </span>
          {!nested && (
            <span className={["mt-0.5 block truncate text-xs leading-4", active ? "text-brand-700/70" : "text-slate-400 group-hover:text-slate-500"].join(" ")}>
              {item.description}
            </span>
          )}
        </span>
      </button>
    );
  };

  const sidebar = (
    <aside className="flex h-full w-60 flex-col border-r border-line bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-line-subtle px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-semibold text-white shadow-sm shadow-brand-600/25">
          JDY
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold leading-5 text-slate-950">报价管理</div>
            <span className="rounded border border-brand-100 bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none text-brand-700">
              Ops
            </span>
          </div>
          <div className="truncate text-xs leading-4 text-slate-500">业务菜单</div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3">
        {navEntries.map((item) => {
          if (!isNavGroup(item)) return renderNavItem(item);

          const open = openGroupKeys.includes(item.key);
          const active = groupHasActiveItem(item);

          return (
            <div key={item.key} className="space-y-0.5">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => toggleGroup(item.key)}
                className={[
                  "group relative flex min-h-[52px] w-full appearance-none items-center gap-3 rounded-md border border-transparent px-3 py-2 text-left shadow-none transition",
                  "focus:outline-none focus:ring-2 focus:ring-brand-200",
                  active
                    ? "bg-slate-50 text-slate-950"
                    : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100/80 text-base text-slate-500 transition group-hover:bg-white group-hover:text-slate-700">
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={["block truncate text-sm font-semibold leading-5", active ? "text-slate-950" : "text-slate-700 group-hover:text-slate-950"].join(" ")}>
                    {item.label}
                  </span>
                  <span className={["mt-0.5 block truncate text-xs leading-4", active ? "text-slate-500" : "text-slate-400 group-hover:text-slate-500"].join(" ")}>
                    {item.description}
                  </span>
                </span>
                <DownOutlined
                  className={[
                    "shrink-0 text-xs text-slate-400 transition-transform group-hover:text-slate-600",
                    open ? "rotate-180" : "rotate-0",
                  ].join(" ")}
                />
              </button>
              {open && (
                <div className="space-y-0.5 border-l border-slate-100 pl-2">
                  {item.children.map((child) => renderNavItem(child, true))}
                </div>
              )}
            </div>
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
          <div className="relative z-10 h-full w-60 shadow-xl">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-60">
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
