import { apiClient } from "../http/client";
import { ProductSearchResult } from "@/types/types";

export const ProductService = {
  async searchProducts(
    keyword: string,
    field: "code" | "name",
    formType?: string
  ) {
    const res = await apiClient.get("/product/search", {
      params: { keyword, field, formType },
    });
    return res.data as ProductSearchResult[];
  },
};
