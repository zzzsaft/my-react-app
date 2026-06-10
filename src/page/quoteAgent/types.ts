export type DocumentStatus =
  | "uploaded"
  | "parsed_blocks"
  | "extracted"
  | "normalized"
  | "dictionary_dirty"
  | "failed";

export type CandidateStatus = "pending" | "approved" | "rejected";
export type CandidateType = "term_type" | "value";

export type ReviewAction =
  | "create_term_type"
  | "approve_term_type_as_alias"
  | "create_value"
  | "approve_value_as_alias"
  | "split_value"
  | "move_value_to_other_term_type"
  | "update_term_type_value_kind"
  | "reject";

export interface ReviewOperation {
  candidateType: CandidateType;
  candidateId: string;
  action: ReviewAction;
  payload: Record<string, unknown>;
}

export interface BatchReviewOptions {
  refreshAffectedDocuments?: boolean;
  deferCandidateRecheck?: boolean;
}

export interface BatchReviewResponse {
  successCount?: number;
  failedCount?: number;
  affectedDocumentIds?: Array<string | number>;
  candidateRecheckDeferred?: boolean;
  [key: string]: unknown;
}

export interface ReviewDraft extends ReviewOperation {
  label: string;
  updatedAt: number;
}

export interface QuoteAgentDocument {
  id?: number | string;
  documentId?: number | string;
  extractionJobId?: string;
  extractionResultId?: number | string;
  status?: DocumentStatus | string;
  fileName?: string;
  filePath?: string;
  itemCount?: number;
  warningCount?: number;
  candidateCount?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface DocumentListResponse {
  items?: QuoteAgentDocument[];
  documents?: QuoteAgentDocument[];
  data?: QuoteAgentDocument[];
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export interface DictionarySummary {
  item_count?: number;
  field_count?: number;
  matched_field_count?: number;
  unmatched_field_count?: number;
  candidate_count?: number;
  warning_count?: number;
  [key: string]: unknown;
}

export interface QuoteAgentField {
  field_name?: string;
  raw_value?: string;
  dictionary?: Record<string, any>;
  masterDataMatch?: Record<string, any> | null;
  master_data_match?: Record<string, any> | null;
  candidate?: Record<string, any> | null;
  evidence?: unknown;
  warnings?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export type ProductMasterDataTermType = "metering_pump_model" | "filter_model";

export interface ProductMasterDataCandidate {
  id?: string | number;
  model?: string;
  name?: string;
  pumpage?: string | number;
  rotateSpeed?: string | number;
  heatingPower?: string | number;
  shearSensitivity?: string | number;
  production?: string | number;
  filterBoard?: string | number;
  dimension?: string;
  weight?: string | number;
  meshDiameter?: string | number;
  effectiveFilterArea?: string | number;
  power?: string | number;
  pressure?: string | number;
  [key: string]: any;
}

export interface ProductMasterDataSearchResponse {
  items?: ProductMasterDataCandidate[];
  results?: ProductMasterDataCandidate[];
  data?: ProductMasterDataCandidate[] | { items?: ProductMasterDataCandidate[]; results?: ProductMasterDataCandidate[] };
  [key: string]: unknown;
}

export interface ProductModelBindingPayload {
  termType: ProductMasterDataTermType;
  rawValue: string;
  fieldName?: string;
  itemIndex?: string | number;
  documentId?: string | number;
  extractionResultId?: string | number;
  sourceTable: "crm_products_pump" | "crm_product_filter";
  masterDataId?: string | number;
  model?: string;
  candidate: ProductMasterDataCandidate;
}

export interface QuoteAgentItem {
  item_index?: number | string;
  item_quantity?: string;
  itemProductTypeHint?: string;
  itemProductTypeHintConfidence?: number | string;
  itemProductTypeHintRawValue?: string;
  fields?: QuoteAgentField[];
  warnings?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface ExtractionDetail {
  document?: QuoteAgentDocument;
  extraction?: Record<string, unknown>;
  dictionary?: DictionarySummary | Record<string, unknown>;
  summary?: DictionarySummary;
  items?: QuoteAgentItem[];
  warnings?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface Candidate {
  id: string | number;
  status?: CandidateStatus | string;
  candidateType?: CandidateType;
  rawFieldName?: string;
  rawValue?: string;
  termType?: string;
  reason?: string;
  evidence?: Record<string, any> | null;
  documentId?: number | string;
  extractionResultId?: number | string;
  itemIndex?: number | string;
  sourceProductType?: string;
  sourceRawValue?: string;
  reviewSuggestion?: Record<string, any> | null;
  [key: string]: any;
}

export interface CandidatesResponse {
  termTypeCandidates: Candidate[];
  valueCandidates: Candidate[];
  suggestions?: unknown;
}

export interface DictionaryTermType {
  id?: string | number;
  termType?: string;
  displayName?: string;
  quoteDisplayName?: string;
  category?: string;
  valueKind?: string;
  applicableProductTypes?: string[];
  aliases?: string[];
  aliasNames?: string[];
  enumValues?: unknown;
  sortOrder?: number;
  [key: string]: any;
}

export interface DictionaryValue {
  id?: string | number;
  termType?: string;
  canonicalValue?: string;
  displayName?: string;
  aliasNames?: string[];
  aliases?: string[];
  [key: string]: any;
}

export interface ProductTypeOption {
  canonicalValue?: string;
  value?: string;
  displayName?: string;
  label?: string;
  [key: string]: any;
}

export interface PendingLlmUploadJob {
  status?: string;
  concurrency?: number;
  total?: number;
  processed?: number;
  successCount?: number;
  failedCount?: number;
  currentDocumentIds?: Array<number | string>;
  documentProgress?: Array<Record<string, any>>;
  startedAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface DictionaryOptions {
  termTypes: DictionaryTermType[];
  values: DictionaryValue[];
  productTypes: ProductTypeOption[];
}
