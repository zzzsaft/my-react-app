import { apiClient } from "../http/client";

export const OrderService = {
  async getOrderInfo(orderId: string) {
    const res = await apiClient.get("/order/get", { params: { orderId } });
    return res.data;
  },
};
