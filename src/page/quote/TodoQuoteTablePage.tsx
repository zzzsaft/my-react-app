import React from "react";
import { Typography } from "antd";
import QuoteTable from "@/components/quote/QuoteTable";

const TodoQuoteTablePage: React.FC = () => {
  return (
    <>
      <Typography.Title level={3}>代办任务</Typography.Title>
      <QuoteTable type="history" status="checking" />
      {/* <QuoteTable type="oa" approvalNode="项目支持,报价单" /> */}
    </>
  );
};

export default TodoQuoteTablePage;
