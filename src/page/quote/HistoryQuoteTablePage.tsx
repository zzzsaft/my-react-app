import React from "react";
import { Typography } from "antd";
import QuoteTable from "../../components/quote/QuoteTable";
import { AddHistoryModal } from "../../components/quote/AddHistoryModal";

const HistoryQuoteTablePage: React.FC = () => {
  return (
    <>
      <Typography.Title level={3}>历史报价单</Typography.Title>
      <AddHistoryModal />
      <QuoteTable type="history" />
    </>
  );
};

export default HistoryQuoteTablePage;
