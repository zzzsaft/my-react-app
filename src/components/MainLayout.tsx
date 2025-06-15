import React, { useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { Layout, Menu, Button, Avatar, Dropdown, Space } from "antd";
import { theme } from "antd/lib";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useAuthStore } from "../store/useAuthStore";
import { GlobalModal } from "./GlobalModal";

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const name = useAuthStore.getState().name;
  const avatar = useAuthStore.getState().avatar;
  // 用户下拉菜单
  const userDropdownItems: MenuProps["items"] = [
    // {
    //   key: "profile",
    //   label: "个人中心",
    //   icon: <UserOutlined />,
    // },
    {
      key: "settings",
      label: "系统设置",
      icon: <SettingOutlined />,
    },
    // {
    //   type: "divider",
    // },
    // {
    //   key: "logout",
    //   label: "退出登录",
    //   icon: <LogoutOutlined />,
    // },
  ];

  // 菜单项配置
  const menuItems: MenuProps["items"] = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "首页",
    },
    {
      key: "/quote/history",
      label: "历史报价单",
    },
    {
      key: "/quote/oa",
      label: "OA报价单",
    },
    {
      key: "/quote/todo",
      label: "代办任务",
    },
    {
      key: "/template",
      label: "模版管理",
    },
    // {
    //   key: "/dashboard",
    //   icon: <SettingOutlined />,
    //   label: "仪表盘",
    // },
    // {
    //   key: "/admin/users",
    //   icon: <UserOutlined />,
    //   label: "用户管理",
    // },
  ];

  return (
    <>
      <Layout className="h-screen">
        {/* 顶部导航栏 */}
        <Header
          style={{
            height: 48,
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            transition: "all 0.2s ease",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />

          <Dropdown menu={{ items: userDropdownItems }} trigger={["click"]}>
            <div
              className="cursor-pointer hover:bg-gray-100 px-2 rounded"
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{
                  marginRight: 8,
                }}
                src={avatar}
              />
              <span
                className="hidden sm:inline"
                style={{
                  lineHeight: "24px",
                }}
              >
                {name}
              </span>
            </div>
          </Dropdown>
        </Header>

        {/* 侧边栏 - 优化过渡效果 */}
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 48,
            bottom: 0,
            zIndex: 999,
            overflow: "hidden",
            width: 220,
            transform: collapsed ? "translateX(-100%)" : "translateX(0)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
              borderRight: "1px solid #f0f0f0",
              height: "100%",
              overflow: "auto",
            }}
            width={220}
            collapsed={false}
          >
            <div className="h-16 flex items-center justify-center">
              {/* <div className="text-lg font-semibold">你的应用名称</div> */}
            </div>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => {
                navigate(key);
                setCollapsed(true);
              }}
              items={menuItems}
              style={{ borderRight: 0 }}
            />
          </Sider>
        </div>

        {/* 内容区域 - 添加遮罩层效果 */}

        <div
          style={{
            position: "fixed",
            top: 48,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
            opacity: collapsed ? 0 : 1,
            pointerEvents: collapsed ? "none" : "auto",
            transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "opacity", // 优化性能
          }}
          onClick={() => setCollapsed(true)}
          className={`${collapsed ? "invisible" : "visible"}`} // 双重控制确保动画流畅
        />

        {/* 主内容区域 */}
        <Content
          style={{
            marginTop: 48,
            minHeight: "calc(100vh - 48px)",
            padding: 16,
            background: "#f5f5f5",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              background: colorBgContainer,
              minHeight: "calc(100vh - 80px)",
              borderRadius: borderRadiusLG,
              padding: 16,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
      <GlobalModal />
    </>
  );
};

export default MainLayout;
