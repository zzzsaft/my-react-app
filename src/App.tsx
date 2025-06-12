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
import TestComponent from "./components/test";
import AuthCallback from "./page/AuthCallback";
import MainLayout from "./components/MainLayout";
import JdyRedirect from "./page/JdyRedirect";
import HistoryQuoteTablePage from "./page/quote/HistoryQuoteTablePage";
import OAQuoteTablePage from "./page/quote/OAQuoteTablePage";
import QuoteFormPage from "./page/quote/QuoteFormPage";
import { NoPermissionPage } from "./page/NoPermissionPage";

const App: React.FC = () => {
  return (
    <ConfigProvider theme={{ cssVar: true }}>
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
                <Route path=":id" element={<QuoteFormPage />} />
              </Route>
            </Route>
            <Route path="/jdy_redirect" element={<JdyRedirect />} />
          </Route>

          {/* 不需要鉴权的路由 */}
          <Route path="/auth-callback" element={<AuthCallback />} />
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
