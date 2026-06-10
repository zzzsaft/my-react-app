import React from "react";
import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import { AuthGuard } from "./components/general/AuthGuard";
import ExternalContactBindingPage from "./page/externalContact";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
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
import QuoteAgentPage from "./page/quoteAgent";

dayjs.locale("zh-cn");

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard children={<Outlet />} />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<div />} />
            <Route path="external_contact" element={<ExternalContactBindingPage />} />
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
            <Route path="quote-agent" element={<QuoteAgentPage />} />
            <Route path="quote-agent/:documentId" element={<QuoteAgentPage />} />
          </Route>
          <Route path="/jdy_redirect" element={<JdyRedirect />} />
        </Route>
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/quote/share/:uuid" element={<QuoteSharePage />} />
        <Route path="/login" element={<div />} />
        <Route path="/error/no-permission" element={<NoPermissionPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
