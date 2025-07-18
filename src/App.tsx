import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Outlet,
} from "react-router-dom";
import { AuthGuard } from "./components/general/AuthGuard";
import { Opportunity } from "./types/types";
import ExternalContactBindingPage from "./page/externalContact";
import OpportunitySearchPage from "./page/OpportunitySearch";
import ProductCascader from "./components/quote/ProductCascader";
import QuoteItemsTable from "./components/quote/QuoteItemsTable";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");
import TestComponent from "./components/test";
import AuthCallback from "./page/AuthCallback";
import MainLayout from "./components/MainLayout";
import JdyRedirect from "./page/JdyRedirect";
import HistoryQuoteTablePage from "./page/quote/HistoryQuoteTablePage";
import OAQuoteTablePage from "./page/quote/OAQuoteTablePage";
import TodoQuoteTablePage from "./page/quote/TodoQuoteTablePage";
import QuoteFormPage from "./page/quote/QuoteFormPage";
import QuoteSharePage from "./page/quote/QuoteSharePage";
import TemplateListPage from "./page/template/TemplateListPage";
import { NoPermissionPage } from "./page/NoPermissionPage";

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN} theme={{ cssVar: true }}>
      <BrowserRouter>
        <Routes>
          {/* 需要鉴权的路由 */}
          <Route element={<AuthGuard children={<Outlet />} />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<div />} /> {/* 替换空div为实际页面 */}
              <Route
                path="external_contact"
                element={<ExternalContactBindingPage />}
              />
              <Route path="quote" element={<Outlet />}>
                <Route index element={<HistoryQuoteTablePage />} />
                <Route path="history" element={<HistoryQuoteTablePage />} />
                <Route path="oa" element={<OAQuoteTablePage />} />
                <Route path="todo" element={<TodoQuoteTablePage />} />
                <Route path=":id" element={<QuoteFormPage />} />
              </Route>
              <Route path="template" element={<Outlet />}>
                <Route index element={<TemplateListPage />} />
              </Route>
            </Route>
            <Route path="/jdy_redirect" element={<JdyRedirect />} />
          </Route>

          {/* 不需要鉴权的路由 */}
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/quote/share/:uuid" element={<QuoteSharePage />} />
          <Route path="/login" element={<div />} />
          <Route path="/error/no-permission" element={<NoPermissionPage />} />

          {/* 可选的404页面
          <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
