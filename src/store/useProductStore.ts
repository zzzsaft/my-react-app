// store/useQuoteStore.ts
import { create } from "zustand";
import { nanoid } from "nanoid";
import { message } from "antd";
import { OpportunityService } from "../api/services/opportunity.service";
import { isEqual } from "lodash-es";
import { produce } from "immer";
import zukeeper from "zukeeper";
import { throttle, values } from "lodash-es";
import { ProductCategory, Quote, QuoteItem } from "../types/types";
import { immer } from "zustand/middleware/immer";
import { QuoteService } from "../api/services/quote.service";
import { insertAfter } from "../util/valueUtil";

interface Pump {
  model: string;
  pumpage: string;
  heatingPower: string;
  rotateSpeed: string;
  shearSensitivity: string;
  production: string;
  remark: string;
}

interface QuotesStore {
  loading: boolean;
  categories: ProductCategory[];
  pump: Pump[];
  configModalVisible: boolean;
  initialize: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchPump: () => Promise<void>;
}

export const useProductStore = create<QuotesStore>()(
  immer((set, get) => ({
    quotes: [],
    pump: [],
    categories: [],
    loading: false,
    configModalVisible: false,

    initialize: async () => {
      const categories = await OpportunityService.getProductCategory();
      set({ categories });
    },

    fetchCategories: throttle(async () => {
      set({ loading: true });
      const categories = await OpportunityService.getProductCategory();
      set({ categories, loading: false });
    }, 1000),

    fetchPump: throttle(async () => {
      set({ loading: true });
      const pump = await OpportunityService.getProductPump();
      set({ pump, loading: false });
    }, 1000),
  }))
);
