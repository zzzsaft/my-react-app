import { apiClient } from "@/api/http/client";
import type {
  BatchReviewOptions,
  BatchReviewResponse,
  CandidateClusterFilters,
  CandidateClusterReviewPromptResponse,
  CandidateClustersResponse,
  CandidateStatus,
  CandidatesResponse,
  DictionaryOptions,
  DictionaryTermType,
  DictionaryValue,
  DocumentListResponse,
  ExtractionDetail,
  PendingLlmUploadJob,
  ProductMasterDataCandidate,
  ProductMasterDataSearchResponse,
  ProductMasterDataTermType,
  ProductModelBindingPayload,
  ProductTypeOption,
  RenormalizeBatchParams,
  RenormalizeBatchResponse,
  ReviewOperation,
} from "../types";

const unwrap = <T>(response: { data: T }) => response.data;
const slowRequest = { timeout: 120000 };
const defaultReviewer = "Codex";
const productMasterDataSearchPath: Record<ProductMasterDataTermType, string> = {
  metering_pump_model: "/product/pump/get",
  filter_model: "/product/filter/get",
};

const withReviewer = (operation: ReviewOperation): ReviewOperation => ({
  ...operation,
  payload: {
    reviewedBy: defaultReviewer,
    ...operation.payload,
  },
});

const productMasterDataItems = (response: ProductMasterDataSearchResponse | ProductMasterDataCandidate[] | unknown): ProductMasterDataCandidate[] => {
  if (Array.isArray(response)) return response as ProductMasterDataCandidate[];
  const value = response as ProductMasterDataSearchResponse & { candidates?: ProductMasterDataCandidate[] };
  if (Array.isArray(value?.candidates)) return value.candidates;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.results)) return value.results;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.items)) return value.data.items;
  if (Array.isArray(value?.data?.results)) return value.data.results;
  return [];
};

const dictionaryTermTypeFromResponse = (response: DictionaryTermType | { termType: DictionaryTermType }) =>
  "termType" in response && typeof response.termType === "object" && response.termType !== null
    ? response.termType
    : response as DictionaryTermType;

const dictionaryValueFromResponse = (response: DictionaryValue | { value: DictionaryValue }) =>
  "value" in response && typeof response.value === "object" && response.value !== null
    ? response.value
    : response as DictionaryValue;

export const quoteAgentService = {
  async uploadContract(file: File): Promise<ExtractionDetail> {
    const formData = new FormData();
    formData.append("file", file);
    return unwrap(
      await apiClient.post("/quoteAgent/contracts/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      }),
    );
  },

  async listDocuments(params: {
    page: number;
    pageSize: number;
    status?: string;
    q?: string;
  }): Promise<DocumentListResponse> {
    return unwrap(await apiClient.get("/quoteAgent/extractions", { params, ...slowRequest }));
  },

  async getExtraction(documentId: string | number): Promise<ExtractionDetail> {
    return unwrap(await apiClient.get(`/quoteAgent/extractions/${documentId}`, slowRequest));
  },

  async getContract(documentId: string | number): Promise<ExtractionDetail> {
    return unwrap(await apiClient.get(`/quoteAgent/contracts/${documentId}`, slowRequest));
  },

  async renormalize(documentId: string | number): Promise<ExtractionDetail> {
    return unwrap(
      await apiClient.post(`/quoteAgent/extractions/${documentId}/renormalize`, undefined, slowRequest),
    );
  },

  async renormalizeBatch(params: RenormalizeBatchParams): Promise<RenormalizeBatchResponse> {
    return unwrap(await apiClient.post("/quoteAgent/extractions/renormalize-batch", params, slowRequest));
  },

  async reextract(documentId: string | number, params?: { llmModel?: string }): Promise<ExtractionDetail> {
    return unwrap(await apiClient.post(`/quoteAgent/extractions/${documentId}/reextract`, params ?? {}, slowRequest));
  },

  async openDocumentFile(documentId: string | number): Promise<Record<string, unknown>> {
    return unwrap(await apiClient.post(`/quoteAgent/documents/${documentId}/open-file`));
  },

  async startPendingLlmUpload(params?: {
    limit?: number;
    llmModel?: string;
    concurrency?: number;
  }): Promise<{ job: PendingLlmUploadJob }> {
    return unwrap(await apiClient.post("/quoteAgent/documents/pending-llm-upload/start", params ?? {}, slowRequest));
  },

  async getPendingLlmUploadStatus(): Promise<{ job: PendingLlmUploadJob | null }> {
    return unwrap(await apiClient.get("/quoteAgent/documents/pending-llm-upload/status"));
  },

  async getCandidates(params: {
    status: CandidateStatus;
    documentId?: string | number;
    recheckPendingCandidates?: boolean;
  }): Promise<CandidatesResponse> {
    return unwrap(await apiClient.get("/quoteAgent/candidates", { params, ...slowRequest }));
  },

  async getCandidateClusterReviewPrompt(): Promise<CandidateClusterReviewPromptResponse | string> {
    return unwrap(await apiClient.get("/quoteAgent/candidates/clusters/review-prompt", slowRequest));
  },

  async getCandidateClusters(params: CandidateClusterFilters): Promise<CandidateClustersResponse> {
    return unwrap(await apiClient.get("/quoteAgent/candidates/clusters", { params, ...slowRequest }));
  },

  async suggestCandidateClusterReviewsBatch(params: CandidateClusterFilters & {
    candidateType?: string;
    clusterIds?: Array<string | number>;
    force?: boolean;
    model?: string;
  }): Promise<unknown> {
    return unwrap(await apiClient.post("/quoteAgent/candidates/clusters/suggestions/batch", params, slowRequest));
  },

  async getDictionaryOptions(): Promise<DictionaryOptions> {
    const [termTypesResponse, valuesResponse, productTypesResponse] = await Promise.all([
      apiClient.get<{ termTypes: DictionaryTermType[] }>("/quoteAgent/dictionary/term-types", slowRequest),
      apiClient.get<{ values: DictionaryValue[] }>("/quoteAgent/dictionary/values", slowRequest),
      apiClient.get<ProductTypeOption[] | { productTypes: ProductTypeOption[] }>(
        "/quoteAgent/dictionary/product-types",
        slowRequest,
      ),
    ]);

    const productTypesData = productTypesResponse.data;
    return {
      termTypes: termTypesResponse.data.termTypes ?? [],
      values: valuesResponse.data.values ?? [],
      productTypes: Array.isArray(productTypesData)
        ? productTypesData
        : productTypesData.productTypes ?? [],
    };
  },

  async getDictionaryValues(termType?: string): Promise<DictionaryValue[]> {
    const response = await apiClient.get<{ values: DictionaryValue[] }>("/quoteAgent/dictionary/values", {
      params: termType ? { termType } : undefined,
      ...slowRequest,
    });
    return response.data.values ?? [];
  },

  async createTermType(payload: Partial<DictionaryTermType>): Promise<DictionaryTermType> {
    return dictionaryTermTypeFromResponse(
      unwrap(await apiClient.post<DictionaryTermType | { termType: DictionaryTermType }>(
        "/quoteAgent/dictionary/term-types",
        payload,
        slowRequest,
      )),
    );
  },

  async updateTermType(
    termTypeId: string | number,
    payload: Partial<DictionaryTermType>,
  ): Promise<DictionaryTermType> {
    return dictionaryTermTypeFromResponse(unwrap(
      await apiClient.patch(
        `/quoteAgent/dictionary/term-types/${encodeURIComponent(String(termTypeId))}`,
        payload,
        slowRequest,
      ),
    ));
  },

  async createDictionaryValue(payload: Partial<DictionaryValue>): Promise<DictionaryValue> {
    return dictionaryValueFromResponse(
      unwrap(await apiClient.post<DictionaryValue | { value: DictionaryValue }>(
        "/quoteAgent/dictionary/values",
        payload,
        slowRequest,
      )),
    );
  },

  async updateDictionaryValue(
    valueId: string | number,
    payload: Partial<DictionaryValue>,
  ): Promise<DictionaryValue> {
    return dictionaryValueFromResponse(unwrap(
      await apiClient.patch(
        `/quoteAgent/dictionary/values/${encodeURIComponent(String(valueId))}`,
        payload,
        slowRequest,
      ),
    ));
  },

  async suggestTermTypeCandidate(
    candidateId: string | number,
    params?: { model?: string; force?: boolean },
  ): Promise<unknown> {
    return unwrap(
      await apiClient.post(`/quoteAgent/candidates/term-type/${candidateId}/suggest`, params ?? {}, slowRequest),
    );
  },

  async suggestValueSplit(
    candidateId: string | number,
    params?: { model?: string; force?: boolean },
  ): Promise<unknown> {
    return unwrap(
      await apiClient.post(`/quoteAgent/candidates/value/${candidateId}/split-suggest`, params ?? {}, slowRequest),
    );
  },

  async suggestCandidateReviewsBatch(params: {
    status?: CandidateStatus;
    documentId?: string | number;
    model?: string;
    force?: boolean;
  }): Promise<unknown> {
    return unwrap(await apiClient.post("/quoteAgent/candidates/suggestions/batch", params, slowRequest));
  },

  async searchProductMasterData(
    termType: ProductMasterDataTermType,
    model: string,
  ): Promise<ProductMasterDataCandidate[]> {
    const response = unwrap<ProductMasterDataSearchResponse>(
      await apiClient.get(productMasterDataSearchPath[termType], {
        params: { model },
        ...slowRequest,
      }),
    );
    return productMasterDataItems(response);
  },

  async bindProductModel(payload: ProductModelBindingPayload): Promise<unknown> {
    const { sourceTable, candidate, ...rest } = payload;
    return unwrap(
      await apiClient.post(
        "/quoteAgent/master-data/model-binding",
        {
          ...rest,
          source: sourceTable,
          masterDataId: payload.masterDataId ?? candidate.id,
        },
        slowRequest,
      ),
    );
  },

  async submitReview(operation: ReviewOperation): Promise<unknown> {
    return this.submitBatchReviews([operation]);
  },

  async submitBatchReviews(
    operations: ReviewOperation[],
    options: BatchReviewOptions = { deferCandidateRecheck: true },
  ): Promise<BatchReviewResponse> {
    return unwrap(
      await apiClient.post("/quoteAgent/candidates/reviews/batch", {
        ...options,
        operations: operations.map(withReviewer),
      }, slowRequest),
    );
  },
};
