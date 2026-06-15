import { useState } from "react";
import { quoteAgentService } from "../../services/quoteAgent.service";
import type { ProductConfigSearchResponse } from "../../types";
import { errorText } from "../../utils";

export function useProductConfigSearchState() {
  const [productNumber, setProductNumber] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [result, setResult] = useState<ProductConfigSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    const keyword = productNumber.trim();
    if (!keyword) {
      setError("请填写产品编号");
      setResult(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setResult(
        await quoteAgentService.searchProductConfigs({
          productNumber: keyword,
          customerId: customerId.trim() || undefined,
          includeErp: true,
        }),
      );
    } catch (error) {
      setError(errorText(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    customerId,
    error,
    loading,
    productNumber,
    result,
    search,
    setCustomerId,
    setProductNumber,
  };
}
