// store/useQuoteStore.ts
import { create } from "zustand";
import { nanoid } from "nanoid";
import { message } from "antd";
import { OpportunityService } from "../api/services/opportunity.service";
import { isEqual } from "lodash-es";
import { produce } from "immer";
import zukeeper from "zukeeper";
import { throttle } from "lodash-es";
import {
  ProductCategory,
  Quote,
  QuoteItem,
  FilterProduct,
} from "../types/types";
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

interface ProductStore {
  loading: boolean;
  categories: ProductCategory[];
  pump: Pump[];
  filter: FilterProduct[];
  configModalVisible: boolean;
  initialize: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchPump: () => Promise<void>;
  fetchFilter: () => Promise<void>;
}

export const useProductStore = create<ProductStore>()(
  immer((set, get) => ({
    quotes: [],
    pump: [],
    filter: [],
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

    fetchFilter: throttle(async () => {
      set({ loading: true });
      const filter = await OpportunityService.getProductFilter();
      set({ filter, loading: false });
    }, 1000),
  }))
);
