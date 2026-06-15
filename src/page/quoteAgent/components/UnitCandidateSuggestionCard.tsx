import type { UnitCandidate, UnitCandidateReviewSuggestion } from "../types";
import { payloadFromUnitSuggestion, unitCandidateId } from "../unitCandidateReview.utils";

type Props = {
  candidate: UnitCandidate;
  suggestion?: UnitCandidateReviewSuggestion;
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
};

const toneClass = (risk?: string) => {
  if (String(risk).toLowerCase() === "high") return "border-rose-200 bg-rose-50 text-rose-700";
  if (String(risk).toLowerCase() === "medium") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
};

export function UnitCandidateSuggestionCard({ candidate, suggestion, checked, disabled, onToggle }: Props) {
  if (!suggestion) {
    return <div className="border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">尚未生成 AI 建议</div>;
  }

  const action = suggestion.recommendedAction;
  const actionable = action === "approve" || action === "reject";
  const payload = payloadFromUnitSuggestion(candidate, suggestion);
  const needsHumanReview = Boolean(suggestion.needsHumanReview ?? suggestion.needs_human_review);

  return (
    <div className={`border bg-white p-3 ${actionable ? "border-slate-200" : "border-amber-200 bg-amber-50"}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
          <input type="checkbox" checked={checked} disabled={disabled || !actionable} onChange={onToggle} />
          {action}
        </label>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">candidate {unitCandidateId(candidate)}</span>
          <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">confidence {Number(suggestion.confidence ?? 0).toFixed(2)}</span>
          <span className={`border px-2 py-1 ${toneClass(suggestion.riskLevel)}`}>risk {String(suggestion.riskLevel ?? "-")}</span>
          {needsHumanReview && <span className="border border-amber-200 bg-white px-2 py-1 text-amber-700">needs human review</span>}
        </div>
      </div>

      {action === "approve" && (
        <dl className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-700 md:grid-cols-3">
          <div>
            <dt className="text-slate-400">canonicalUnit</dt>
            <dd className="mt-1 break-words font-medium text-slate-900">{payload.canonicalUnit || "-"}</dd>
          </div>
          <div>
            <dt className="text-slate-400">aliasValue</dt>
            <dd className="mt-1 break-words font-medium text-slate-900">{payload.aliasValue || "-"}</dd>
          </div>
          <div>
            <dt className="text-slate-400">displayUnit</dt>
            <dd className="mt-1 break-words font-medium text-slate-900">{payload.displayUnit || "-"}</dd>
          </div>
        </dl>
      )}

      {suggestion.reason && <div className="mt-2 text-xs text-slate-600">{suggestion.reason}</div>}
    </div>
  );
}
