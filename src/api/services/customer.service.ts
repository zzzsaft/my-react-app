// import type { LoginParams, UserInfo } from '../types/auth.d';
import { redirect } from "react-router-dom";
import { apiClient } from "../http/client";

export const CustomerService = {
  async searchCompanies(keyword: string, cancelToken?: any) {
    const company = await apiClient.get("/customer/search", {
      params: { keyword },
      cancelToken: cancelToken,
    });
    return company.data.map((item: any) => ({
      key: item.id,
      value: item.name,
      ...item,
    }));
  },
  async getJdyId(id: string) {
    const res = await apiClient.get("/customer/jdy/get", {
      params: { id },
    });
    return res.data.link;
  },
  async getInfo(id: string) {
    const res = await apiClient.get("/customer/get", {
      params: { id },
    });
    return res.data;
  },
  async getContacts(id: string) {
    const res = await apiClient.get("/customer/contact/get", {
      params: { id },
    });
    const data = res.data as {
      contact?: any[];
      general?: { fax?: string[]; address?: string[] };
    };
    const contacts = (data?.contact ?? []).map((item: any) => ({
      name: item.contact ?? item.name,
      phone: item.phone,
      address: item.address,
      fax: item.fax,
    }));
    return {
      contacts,
      general: {
        fax: data?.general?.fax ?? [],
        address: data?.general?.address ?? [],
      },
    } as {
      contacts: any[];
      general: { fax: string[]; address: string[] };
    };
  },
  async matchCustomer(payload: {
    externalUserId: string;
    corpName: string;
    jdyId: string;
    name: string;
    position: string;
    remark: string;
    mobile: string;
    isKeyDecisionMaker: boolean;
    updateQywxRemark: boolean;
  }) {
    const res = await apiClient.post("/customer/match", {
      ...payload,
    });
    return res.data;
  },
};
