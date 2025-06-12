import React from "react";
import { Typography } from "antd";
import QuoteTable from "../../components/quote/QuoteTable";

const OAQuoteTablePage: React.FC = () => {
  return (
    <>
      <Typography.Title level={3}>OA报价单</Typography.Title>
      <QuoteTable type="oa" />
    </>
  );
};

export default OAQuoteTablePage;
