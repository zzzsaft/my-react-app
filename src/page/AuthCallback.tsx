// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { useAuthStore } from "../store/useAuthStore";
import useApp from "antd/es/app/useApp";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithCode } = useAuthStore();
  const { message } = useApp(); // 只能在组件内调用
  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      if (!code) {
        message.error("缺少认证参数");
        // navigate("/login");
        return;
      }
      // console.log("code", code);
      try {
        await loginWithCode(code);

        // 默认跳转首页
        let redirect = "/";
        if (state) {
          try {
            const parsedState = JSON.parse(decodeURIComponent(state));
            // console.log(parsedState);
            if (parsedState.redirect) {
              redirect = parsedState.redirect;
            }
          } catch (e) {
            console.error("解析 state 失败", e);
          }
        }
        navigate(redirect, { replace: true });
      } catch (error) {
        message.error("登录失败");
        navigate("/login");
      }
    };

    handleCallback();
  }, [location, loginWithCode, message, navigate]);

  return (
    <div className="full-page-spin">
      <Spin tip="正在验证登录状态..." size="large" />
    </div>
  );
}
