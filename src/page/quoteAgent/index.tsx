import { DeepSeekPromptModal } from "./components/DeepSeekPromptModal";
import { ItemBlock } from "./components/ItemBlock";
import { candidateStatuses, documentStatuses } from "./constants";
import { useQuoteAgentPageState } from "./hooks/useQuoteAgentPageState";
import "./styles.css";
import type { CandidateStatus, DocumentStatus } from "./types";
import { detailWarnings, docId, docName } from "./utils";

export default function QuoteAgentPage() {
  const {
    activeFieldKey,
    allCandidates,
    applyDeepSeekDrafts,
    batchSubmitting,
    candidateError,
    candidateStatus,
    currentDocument,
    currentDocumentId,
    deepSeekOpen,
    detail,
    detailError,
    documentAction,
    documents,
    documentStatus,
    drafts,
    error,
    expandedAllFieldItems,
    expandedFieldKey,
    fileInputRef,
    globalCandidates,
    hideNonReviewFields,
    hideTasksWithoutCandidates,
    items,
    llmJob,
    loadDocuments,
    loadingCandidates,
    loadingDetail,
    loadingDocuments,
    message,
    options,
    page,
    promptCandidates,
    refreshCurrentTask,
    saveDraft,
    search,
    selectedDocumentId,
    selectedDraftKeys,
    setActiveFieldKey,
    setCandidateStatus,
    setDeepSeekOpen,
    setDocumentStatus,
    setExpandedAllFieldItems,
    setExpandedFieldKey,
    setGlobalCandidates,
    setHideNonReviewFields,
    setHideTasksWithoutCandidates,
    setPage,
    setSearch,
    setSelectedDocumentId,
    setSelectedDraftKeys,
    setUploadOpen,
    startLlmUpload,
    stats,
    submitBatch,
    submitOperations,
    totalPages,
    uploadFile,
    uploadOpen,
    uploading,
  } = useQuoteAgentPageState();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="p-3 sm:p-5">
        <div className="mx-auto max-w-[1600px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-3 py-3">
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-[minmax(260px,1fr)_180px_auto]">
              <input
                className="h-9 border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
                value={search}
                placeholder="搜索文件名"
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setPage(1);
                    loadDocuments(1, true);
                  }
                }}
              />
              <select className="h-9 border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500" value={documentStatus} onChange={(event) => { setPage(1); setDocumentStatus(event.target.value as DocumentStatus | ""); }}>
                {documentStatuses.map((status) => <option key={status.value || "all"} value={status.value}>{status.label}</option>)}
              </select>
              <button className="qa-btn qa-btn-primary" type="button" onClick={() => { setPage(1); loadDocuments(1, true); }} disabled={loadingDocuments}>查找下一个任务</button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button className="qa-btn qa-btn-secondary qa-btn-sm" type="button" disabled={page <= 1 || loadingDocuments} onClick={() => setPage((current) => Math.max(1, current - 1))}>上一页</button>
              <span className="min-w-16 text-center text-xs text-slate-500">{page} / {totalPages}</span>
              <button className="qa-btn qa-btn-secondary qa-btn-sm" type="button" disabled={page >= totalPages || loadingDocuments} onClick={() => setPage((current) => current + 1)}>下一页</button>
              <span className="mx-1 h-5 w-px bg-slate-200" />
              <button className="qa-btn qa-btn-secondary qa-btn-sm" type="button" disabled={!currentDocumentId || loadingDetail || loadingCandidates} onClick={refreshCurrentTask}>{"\u5237\u65b0\u672c\u4efb\u52a1"}</button>
              <button className="qa-btn qa-btn-secondary qa-btn-sm" type="button" disabled={!currentDocumentId || loadingDetail} onClick={() => documentAction("renormalize")}>重归一化</button>
              <button className="qa-btn qa-btn-secondary qa-btn-sm" type="button" disabled={!currentDocumentId || loadingDetail} onClick={() => documentAction("reextract")}>重新解析</button>
              <button className="qa-btn qa-btn-secondary qa-btn-sm" type="button" disabled={!promptCandidates.length} onClick={() => setDeepSeekOpen(true)}>DeepSeek Prompt</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200 bg-white p-3 lg:border-b-0 lg:border-r">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">任务工具</h2>
                <button className="qa-btn qa-btn-secondary qa-btn-sm" type="button" onClick={() => setUploadOpen((open) => !open)}>{uploadOpen ? "收起上传" : "上传文件"}</button>
              </div>

              {uploadOpen && (
                <button
                  type="button"
                  className="mb-3 flex h-16 w-full flex-col items-center justify-center border border-dashed border-blue-300 bg-blue-50 text-sm text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const file = event.dataTransfer.files?.[0];
                    if (file) uploadFile(file);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  disabled={uploading}
                >
                  <span>{uploading ? "上传中" : "拖拽或点击上传"}</span>
                  <span className="text-xs text-blue-500">合同或生产明细文件</span>
                </button>
              )}
              <input ref={fileInputRef} className="hidden" type="file" onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadFile(file); event.currentTarget.value = ""; }} />

              <section className="mb-3">
                <div className="border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold">当前任务</div>
                {documents.length ? (
                  <div className="mt-2 space-y-2">
                    {documents.map((document) => {
                      const id = docId(document);
                      const active = String(id) === String(selectedDocumentId);
                      return (
                        <button key={String(id)} className={`w-full border px-3 py-2 text-left text-sm ${active ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-300"}`} type="button" onClick={() => setSelectedDocumentId(id)}>
                          <div className="line-clamp-2 font-semibold">{docName(document)}</div>
                          <div className="mt-1 text-xs text-slate-500">
                            #{String(id || "-")} · {document.status || "-"} · items {document.itemCount ?? "-"} · warn {document.warningCount ?? "-"} · cand {document.candidateCount ?? "-"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-3 py-5 text-sm text-slate-500">{loadingDocuments ? "正在加载任务" : "没有找到任务。"}</div>
                )}
              </section>

              <section>
                <div className="border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold">LLM 批处理</div>
                <button className="qa-btn qa-btn-secondary mt-3 w-full" type="button" onClick={startLlmUpload}>上传未提取文档到 LLM</button>
                <div className="mt-2 text-xs text-slate-500">
                  {llmJob ? (
                    <div className="space-y-1">
                      <div>状态：{llmJob.status || "-"}</div>
                      <div>进度：{llmJob.processed ?? 0} / {llmJob.total ?? 0}</div>
                      <div>成功 {llmJob.successCount ?? 0}，失败 {llmJob.failedCount ?? 0}</div>
                      <div>当前文档：{llmJob.currentDocumentIds?.join("、") || "-"}</div>
                    </div>
                  ) : "LLM 批处理尚未启动。"}
                </div>
              </section>
            </aside>

            <section className="min-w-0 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-lg font-semibold text-slate-950">字典匹配结果</h1>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {currentDocument ? `${docName(currentDocument)} / 文档 #${currentDocumentId}` : "请选择或上传文档"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">Key {options.termTypes.length}</span>
                    <span className="border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">字段值 {options.values.length}</span>
                    <select className="h-8 border border-slate-300 bg-white px-2 text-xs outline-none focus:border-blue-500" value={candidateStatus} onChange={(event) => setCandidateStatus(event.target.value as CandidateStatus)}>
                      {candidateStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                    <label className="inline-flex h-8 items-center gap-2 border border-slate-200 bg-white px-2 text-xs text-slate-600">
                      <input type="checkbox" checked={globalCandidates} onChange={(event) => setGlobalCandidates(event.target.checked)} />
                      全局候选
                    </label>
                    <label className="inline-flex h-8 items-center gap-2 border border-slate-200 bg-white px-2 text-xs text-slate-600">
                      <input type="checkbox" checked={hideNonReviewFields} onChange={(event) => setHideNonReviewFields(event.target.checked)} />
                      只看需处理字段
                    </label>
                    <label className="inline-flex h-8 items-center gap-2 border border-slate-200 bg-white px-2 text-xs text-slate-600">
                      <input type="checkbox" checked={hideTasksWithoutCandidates} onChange={(event) => setHideTasksWithoutCandidates(event.target.checked)} />
                      隐藏无候选任务
                    </label>
                  </div>
                </div>
              </div>

              {(message || error || detailError || candidateError || loadingCandidates) && (
                <div className="space-y-1 border-b border-slate-200 bg-white px-4 py-2 text-sm">
                  {message && <div className="text-blue-700">{message}</div>}
                  {error && <div className="text-rose-700">操作失败：{error}</div>}
                  {detailError && <div className="text-rose-700">文档详情加载失败：{detailError}</div>}
                  {candidateError && <div className="text-amber-700">候选加载失败：{candidateError}。主明细已保留，可稍后刷新候选。</div>}
                  {loadingCandidates && <div className="text-slate-500">正在刷新候选，不影响当前明细查看。</div>}
                </div>
              )}

              {detailWarnings(detail).length > 0 && (
                <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
                  文档警告 {detailWarnings(detail).length} 条。点击字段“详情”可查看对应 evidence / dictionary / warnings。
                </div>
              )}

              <div className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  ["明细", stats.items],
                  ["字段", stats.fields],
                  ["已匹配", stats.matched],
                  ["未匹配", stats.unmatched],
                  ["候选", stats.candidates],
                  ["警告", stats.warnings],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white px-4 py-3">
                    <div className="text-xl font-semibold text-slate-950">{value}</div>
                    <div className="text-xs text-slate-500">{label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 p-3">
                {loadingDetail ? (
                  <div className="border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">正在加载匹配结果</div>
                ) : !items.length ? (
                  <div className="border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">{currentDocumentId ? "该文档暂无明细。" : "等待选择任务。"}</div>
                ) : (
                  items.map((item) => (
                    <ItemBlock
                      key={String(item.item_index)}
                      item={item}
                      candidates={allCandidates}
                      currentDocumentId={currentDocumentId}
                      extractionResultId={detail?.extraction?.id as string | number | undefined}
                      activeFieldKey={activeFieldKey}
                      expandedFieldKey={expandedFieldKey}
                      drafts={drafts}
                      selectedDraftKeys={selectedDraftKeys}
                      options={options}
                      hideNonReviewFields={hideNonReviewFields}
                      expandedAllFieldItems={expandedAllFieldItems}
                      onOpenReview={setActiveFieldKey}
                      onToggleJson={setExpandedFieldKey}
                      onSaveDraft={saveDraft}
                      onSubmit={submitOperations}
                      onCloseReview={() => setActiveFieldKey("")}
                      onToggleAllFields={(itemKey) => setExpandedAllFieldItems((current) => current.includes(itemKey) ? current.filter((key) => key !== itemKey) : [...current, itemKey])}
                      onToggleDraft={(key) => setSelectedDraftKeys((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])}
                    />
                  ))
                )}
              </div>
            </section>
          </div>

          {selectedDraftKeys.length > 0 && (
            <div className="sticky bottom-0 z-40 flex flex-wrap items-center justify-between gap-2 border-t border-slate-300 bg-slate-900 px-4 py-3 text-white">
              <div className="text-sm">待批量提交 {selectedDraftKeys.length} 条</div>
              <div className="flex gap-2">
                <button className="qa-btn qa-btn-quiet qa-btn-sm !text-white hover:!bg-slate-800" type="button" onClick={() => setSelectedDraftKeys([])}>清空选择</button>
                <button className="qa-btn qa-btn-primary qa-btn-sm" type="button" onClick={submitBatch} disabled={batchSubmitting}>{batchSubmitting ? "提交中" : "批量提交"}</button>
              </div>
            </div>
          )}
        </div>
      </main>

      <DeepSeekPromptModal
        open={deepSeekOpen}
        candidates={promptCandidates}
        onClose={() => setDeepSeekOpen(false)}
        onApply={applyDeepSeekDrafts}
      />
    </div>
  );
}
