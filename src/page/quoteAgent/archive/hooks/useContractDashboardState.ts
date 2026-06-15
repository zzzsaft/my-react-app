import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { quoteAgentService } from "../../services/quoteAgent.service";
import type { ContractArchiveStatus, ContractListItem, ContractSummary } from "../../types";
import { errorText } from "../../utils";

const storageKey = "quote-agent-contract-dashboard-query-v1";

const defaultSummary: ContractSummary = {
  uploadedCount: 0,
  normalizedCount: 0,
  archivedCount: 0,
};

type SavedQueryState = {
  status: ContractArchiveStatus | "";
  q: string;
  productNumber: string;
  customerId: string;
  page: number;
  pageSize: number;
};

const defaultQueryState: SavedQueryState = {
  status: "",
  q: "",
  productNumber: "",
  customerId: "",
  page: 1,
  pageSize: 20,
};

const validStatuses = new Set(["", "uploaded", "normalized", "archived"]);

function readSavedQueryState(): SavedQueryState {
  if (typeof window === "undefined") return defaultQueryState;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "{}") as Partial<SavedQueryState>;
    const page = Number(parsed.page);
    const pageSize = Number(parsed.pageSize);
    return {
      status: validStatuses.has(String(parsed.status ?? "")) ? (parsed.status as ContractArchiveStatus | "") : "",
      q: String(parsed.q ?? ""),
      productNumber: String(parsed.productNumber ?? ""),
      customerId: String(parsed.customerId ?? ""),
      page: Number.isFinite(page) && page > 0 ? page : defaultQueryState.page,
      pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : defaultQueryState.pageSize,
    };
  } catch {
    return defaultQueryState;
  }
}

function writeSavedQueryState(state: SavedQueryState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // localStorage can be unavailable in restricted browser contexts.
  }
}

export function useContractDashboardState() {
  const navigate = useNavigate();
  const [initialQueryState] = useState(readSavedQueryState);
  const [summary, setSummary] = useState<ContractSummary>(defaultSummary);
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [status, setStatus] = useState<ContractArchiveStatus | "">(initialQueryState.status);
  const [q, setQ] = useState(initialQueryState.q);
  const [productNumber, setProductNumber] = useState(initialQueryState.productNumber);
  const [customerId, setCustomerId] = useState(initialQueryState.customerId);
  const [page, setPage] = useState(initialQueryState.page);
  const [pageSize, setPageSize] = useState(initialQueryState.pageSize);
  const [total, setTotal] = useState(0);
  const [selectedArchiveId, setSelectedArchiveId] = useState<string | number>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (nextPage = page) => {
    setLoading(true);
    setError("");
    try {
      const [summaryResponse, listResponse] = await Promise.all([
        quoteAgentService.getContractSummary(),
        quoteAgentService.listContracts({
          page: nextPage,
          pageSize,
          status,
          q: q.trim() || undefined,
          productNumber: productNumber.trim() || undefined,
          customerId: customerId.trim() || undefined,
        }),
      ]);
      setSummary(summaryResponse);
      setContracts(listResponse.items ?? []);
      setTotal(Number(listResponse.total ?? 0));
      setPage(Number(listResponse.page ?? nextPage));
      setPageSize(Number(listResponse.pageSize ?? pageSize));
    } catch (error) {
      setError(errorText(error));
    } finally {
      setLoading(false);
    }
  }, [customerId, page, pageSize, productNumber, q, status]);

  useEffect(() => {
    void load(page);
  }, [load]);

  useEffect(() => {
    writeSavedQueryState({ status, q, productNumber, customerId, page, pageSize });
  }, [customerId, page, pageSize, productNumber, q, status]);

  const search = () => {
    setPage(1);
    void load(1);
  };

  const openContract = (contract: ContractListItem) => {
    if (contract.status === "archived" && contract.archiveId) {
      setSelectedArchiveId(contract.archiveId);
      return;
    }
    navigate(`/quote-agent/contracts/${contract.documentId}`);
  };

  const closeArchiveModal = () => setSelectedArchiveId("");

  return {
    contracts,
    customerId,
    error,
    loading,
    page,
    pageSize,
    productNumber,
    q,
    closeArchiveModal,
    setCustomerId,
    setPage,
    setPageSize,
    setProductNumber,
    setQ,
    setStatus,
    selectedArchiveId,
    status,
    summary,
    total,
    load,
    openContract,
    search,
  };
}
