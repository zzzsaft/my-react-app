// import type { LoginParams, UserInfo } from '../types/auth.d';
import { redirect } from "react-router-dom";
import { apiClient } from "../http/client";
import { Quote, QuoteItem } from "../../types/types";

export const QuoteService = {
  async createQuote(params: {
    customerName: string;
    customerId: string;
    quoteId?: string;
    date: Date;
    type: string;
    status: string;
    orderId?: string;
  }) {
    const quote = await apiClient.post("/quote/create", {
      ...params,
    });
    return quote.data;
  },
  async createQuoteItem(
    quoteId: number,
    parentId?: number | null,
    params?: Partial<QuoteItem>
  ) {
    const quote = await apiClient.post("/quoteItem/create", {
      quoteId,
      parentId,
      params: {
        ...params,
        discountRate: 100,
      },
    });
    return quote.data;
  },
  async deleteQuoteItem(quoteItemId: number) {
    const quote = await apiClient.delete("/quoteItem/delete", {
      params: { quoteItemId },
    });
    return quote.data;
  },
  async updateQuoteItem(quote: Quote) {
    const result = await apiClient.post("/quote/update", {
      quote,
    });
    return result.data;
  },
  async getQuotes() {
    const quote = await apiClient.get("/quote/get");
    return quote.data as Quote[];
  },
  async getQuote(quoteId: number) {
    const quote = await apiClient.get("/quote/detail/get", {
      params: { quoteId },
    });
    return quote.data;
  },
};
