import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "@/components/ui/core";
import { DatabaseOutlined } from "@/components/ui/icons";
import { QuoteAgentDictionaryManager } from "../quoteAgentDictionary";
import { CandidateClusterDeepSeekPromptModal } from "./components/CandidateClusterDeepSeekPromptModal";
import { CandidateClusterFilters } from "./components/CandidateClusterFilters";
import { CandidateClusterList } from "./components/CandidateClusterList";
import { CandidateClusterManualReviewPanel } from "./components/CandidateClusterManualReviewPanel";
import { CandidateClusterRenormalizePanel } from "./components/CandidateClusterRenormalizePanel";
import { CandidateClusterToast } from "./components/CandidateClusterToast";
import { UnitCandidateReviewPanel } from "./components/UnitCandidateReviewPanel";
import { useCandidateClusterReviewState } from "./hooks/useCandidateClusterReviewState";
import type { CandidateCluster } from "./types";

const reviewPromptText = (value: unknown) => {
  if (typeof value === "string") return value;
  const prompt = value as any;
  return String(prompt?.prompt ?? prompt?.promptTemplate ?? prompt?.content ?? prompt?.systemPrompt ?? "");
};

const numericSummaryValue = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};
import "./styles.css";

export default function CandidateClusterReviewPage() {
  const state = useCandidateClusterReviewState();
  const [activeTab, setActiveTab] = useState<"clusters" | "units">("clusters");
  const [deepSeekOpen, setDeepSeekOpen] = useState(false);
  const [dictionaryOpen, setDictionaryOpen] = useState(false);
  const [manualCluster, setManualCluster] = useState<CandidateCluster | null>(null);
  const promptText = reviewPromptText(state.reviewPrompt);
  const toast = state.loading
    ? { type: "loading" as const, text: "正在刷新候选簇..." }
    : state.suggesting
      ? { type: "loading" as const, text: "正在按候选簇生成 AI 建议，不按文档逐条生成..." }
      : state.renormalizing
        ? { type: "loading" as const, text: "正在重跑 extraction normalization..." }
        : state.submitting
          ? { type: "loading" as const, text: "正在提交已勾选建议..." }
          : state.error
            ? { type: "error" as const, text: `操作失败：${state.error}` }
            : state.message
              ? { type: state.message.includes("未匹配") ? "error" as const : "success" as const, text: state.message }
              : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {toast && <CandidateClusterToast type={toast.type} text={toast.text} />}
      <main className="p-3 sm:p-5">
        <div className="mx-auto max-w-[1600px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-white px-4 py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-slate-950">候选簇审核</h1>
                <p className="mt-1 text-sm text-slate-500">按 candidateCluster 批量治理重复候选，默认展示 pending 并按涉及文档数、出现次数排序。</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="qa-btn qa-btn-secondary" type="button" onClick={() => setDictionaryOpen(true)}>
                  字典管理
                </button>
                <Link className="qa-btn qa-btn-secondary" to="/quote-agent">返回文档审核</Link>
              </div>
            </div>
            {promptText && (
              <details className="mt-3 border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                <summary className="cursor-pointer font-medium text-slate-700">查看 AI 审核提示词说明</summary>
                <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap text-xs">{promptText}</pre>
              </details>
            )}
          </div>

          <div className="qa-review-tabs" role="tablist" aria-label="候选审核类型">
            <div className="qa-review-tabs-track">
              {[
                ["clusters", "候选簇审核"],
                ["units", "单位 Alias 审核"],
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  className="qa-review-tab"
                  onClick={() => setActiveTab(tab as "clusters" | "units")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "clusters" ? (
            <>
              <CandidateClusterFilters
                status={state.status}
                documentId={state.documentId}
                limit={state.limit}
                candidateType={state.candidateType}
                loading={state.loading}
                suggesting={state.suggesting}
                submitting={state.submitting}
                selectedCount={state.selectedClusters.length}
                onStatusChange={state.setStatus}
                onDocumentIdChange={state.setDocumentId}
                onLimitChange={state.setLimit}
                onCandidateTypeChange={state.setCandidateType}
                onRefresh={state.loadClusters}
                onSuggest={state.generateSuggestions}
                onOpenManualPrompt={() => setDeepSeekOpen(true)}
                onSubmitSelected={state.submitSelectedClusters}
              />

              <CandidateClusterRenormalizePanel
                disabled={state.loading || state.suggesting || state.submitting}
                renormalizing={state.renormalizing}
                onRenormalize={state.renormalizeBatch}
              />

              <div className="grid grid-cols-2 gap-px bg-slate-200 md:grid-cols-5">
                {[
                  ["总候选簇", numericSummaryValue(state.clusterSummary.clusterCount, state.visibleClusters.length)],
                  ["当前返回", numericSummaryValue(state.clusterSummary.returnedClusterCount, state.visibleClusters.length)],
                  ["已勾选", state.selectedClusters.length],
                  ["待提交操作", state.selectedClusters.reduce((sum, cluster) => sum + (cluster.batchOperationsPreview?.length ?? 0), 0)],
                  ["状态", state.status],
                ].map(([label, value]) => (
                  <div key={String(label)} className="bg-white px-4 py-3">
                    <div className="text-xl font-semibold text-slate-950">{value}</div>
                    <div className="text-xs text-slate-500">{label}</div>
                  </div>
                ))}
              </div>

              <div className="p-3">
                <CandidateClusterList
                  clusters={state.visibleClusters}
                  expandedClusterIds={state.expandedClusterIds}
                  selectedClusterIds={state.selectedClusterIds}
                  loading={state.loading}
                  submitting={state.submitting}
                  onToggleExpanded={state.toggleExpanded}
                  onToggleSelected={state.toggleSelected}
                  onRetry={(cluster) => state.submitClusters([cluster])}
                  onOpenManualReview={setManualCluster}
                />
              </div>

              {state.selectedClusters.length > 0 && (
                <div className="sticky bottom-0 z-40 flex flex-wrap items-center justify-between gap-2 border-t border-slate-300 bg-slate-900 px-4 py-3 text-white">
                  <div className="text-sm">已勾选 {state.selectedClusters.length} 个候选簇，提交前将再次确认影响 candidate 数量。</div>
                  <button className="qa-btn qa-btn-primary qa-btn-sm" type="button" disabled={state.submitting} onClick={state.submitSelectedClusters}>
                    {state.submitting ? "提交中" : "应用已勾选建议"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <UnitCandidateReviewPanel />
          )}
        </div>
      </main>
      <button
        aria-label="打开字典管理"
        className="qa-floating-dictionary-button"
        type="button"
        onClick={() => setDictionaryOpen(true)}
      >
        <DatabaseOutlined className="qa-floating-dictionary-icon" />
        <span className="qa-floating-dictionary-label">字典管理</span>
      </button>
      <CandidateClusterDeepSeekPromptModal
        open={deepSeekOpen}
        clusters={state.visibleClusters}
        reviewPrompt={state.reviewPrompt}
        promptData={state.promptData}
        onClose={() => setDeepSeekOpen(false)}
        onApply={state.applyManualSuggestions}
      />
      <Modal
        open={dictionaryOpen}
        title="字典管理"
        width={1180}
        footer={null}
        bodyClassName="p-0"
        maskClosable
        onCancel={() => setDictionaryOpen(false)}
      >
        <QuoteAgentDictionaryManager embedded />
      </Modal>
      <CandidateClusterManualReviewPanel
        cluster={manualCluster}
        options={state.options}
        onClose={() => setManualCluster(null)}
        onSave={(cluster, operation) => {
          state.saveManualOperation(cluster, operation);
          setManualCluster(null);
        }}
        onSubmit={async (cluster, operation) => {
          await state.submitManualOperation(cluster, operation);
          setManualCluster(null);
        }}
      />
    </div>
  );
}
