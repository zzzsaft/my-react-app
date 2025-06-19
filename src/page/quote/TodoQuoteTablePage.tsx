import React from "react";
import { Typography } from "antd";
import QuoteTable from "@/components/quote/QuoteTable";
import { useAuthStore } from "@/store/useAuthStore";

const TodoQuoteTablePage: React.FC = () => {
  const userId = useAuthStore.getState().userid?.id;
  return (
    <>
      <Typography.Title level={3}>代办任务</Typography.Title>
      <QuoteTable type="history" currentApprover={userId} />
      {/* <QuoteTable type="oa" approvalNode="项目支持,报价单" /> */}
    </>
  );
};

export default TodoQuoteTablePage;
