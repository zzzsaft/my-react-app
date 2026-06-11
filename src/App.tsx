import React, { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import { AuthGuard } from "./components/general/AuthGuard";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import MainLayout from "./components/MainLayout";

const AuthCallback = lazy(() => import("./page/AuthCallback"));
const CandidateClusterReviewPage = lazy(() => import("./page/quoteAgent/CandidateClusterReviewPage"));
const ExternalContactBindingPage = lazy(() => import("./page/externalContact"));
const HistoryQuoteTablePage = lazy(() => import("./page/quote/HistoryQuoteTablePage"));
const JdyRedirect = lazy(() => import("./page/JdyRedirect"));
const OAQuoteTablePage = lazy(() => import("./page/quote/OAQuoteTablePage"));
const NoPermissionPage = lazy(() =>
  import("./page/NoPermissionPage").then((module) => ({ default: module.NoPermissionPage })),
);
const QuoteAgentPage = lazy(() => import("./page/quoteAgent"));
const QuoteAgentDictionaryPage = lazy(() => import("./page/quoteAgentDictionary"));
const QuoteFormPage = lazy(() => import("./page/quote/QuoteFormPage"));
const QuoteSharePage = lazy(() => import("./page/quote/QuoteSharePage"));
const TemplateListPage = lazy(() => import("./page/template/TemplateListPage"));
const TodoQuoteTablePage = lazy(() => import("./page/quote/TodoQuoteTablePage"));

dayjs.locale("zh-cn");

const pageFallback = (
  <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">
    页面加载中...
  </div>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={pageFallback}>
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
              <Route path="quote-agent/clusters" element={<CandidateClusterReviewPage />} />
              <Route path="quote-agent/dictionary" element={<QuoteAgentDictionaryPage />} />
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
    </Suspense>
  );
};

export default App;
