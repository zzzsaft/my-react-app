import { DictionaryEditorModal } from "./components/DictionaryEditorModal";
import { DictionaryToolbar } from "./components/DictionaryToolbar";
import { TermTypeTable } from "./components/TermTypeTable";
import { useDictionaryManagerState } from "./hooks/useDictionaryManagerState";

type Props = {
  embedded?: boolean;
};

export function QuoteAgentDictionaryManager({ embedded = false }: Props) {
  const state = useDictionaryManagerState();

  return (
    <div className={embedded ? "min-h-0 bg-white text-slate-900" : "min-h-full bg-white text-slate-900"}>
      <div className={embedded ? "bg-white" : "border border-slate-200 bg-white shadow-sm"}>
        <div className="border-b border-slate-200 px-4 py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold text-slate-950">字典管理</h1>
              <p className="mt-1 text-sm text-slate-500">
                查看和编辑 termType、term alias、字段值 alias 及适用属性。
              </p>
            </div>
            <div className="flex gap-2 text-xs text-slate-500">
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                TermType {state.termTypes.length}
              </span>
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                Value {state.values.length}
              </span>
            </div>
          </div>
        </div>

        <DictionaryToolbar
          keyword={state.keyword}
          loading={state.loading}
          onKeywordChange={state.setKeyword}
          onReload={state.reload}
          onCreateTermType={state.openCreateTermType}
        />

        {(state.message || state.error) && (
          <div className="space-y-1 border-b border-slate-200 px-4 py-2 text-sm">
            {state.message && <div className="text-emerald-700">{state.message}</div>}
            {state.error && <div className="text-rose-700">操作失败：{state.error}</div>}
          </div>
        )}

        <div className="p-3">
          <TermTypeTable
            loading={state.loading}
            rows={state.filteredTermTypes}
            values={state.values}
            productTypes={state.productTypes}
            onEdit={state.openEditTermType}
            onCreateValue={state.openCreateValue}
            onEditValue={state.openEditValue}
            onUpdateTermType={state.updateDictionaryTermTypeField}
            onUpdateValue={state.updateDictionaryValueField}
          />
        </div>
      </div>

      {state.editor && (
        <DictionaryEditorModal
          editor={state.editor}
          saving={state.saving}
          termTypes={state.termTypes}
          productTypes={state.productTypes}
          onChange={state.updateEditorValues}
          onSubmit={state.submitEditor}
          onClose={state.closeEditor}
        />
      )}
    </div>
  );
}

export default function QuoteAgentDictionaryPage() {
  return <QuoteAgentDictionaryManager />;
}
