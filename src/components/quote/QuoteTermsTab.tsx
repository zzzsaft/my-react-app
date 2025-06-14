import React from "react";
import { Button } from "antd";
import TermsTable from "./TermsTable";
import { Clause } from "@/types/types";

interface QuoteTermsTabProps {
  value: Clause[];
  onChange: (terms: Clause[]) => void;
  onSetDefault: () => void;
}

const QuoteTermsTab: React.FC<QuoteTermsTabProps> = ({
  value,
  onChange,
  onSetDefault,
}) => {
  return (
    <>
      <Button type="dashed" onClick={onSetDefault} style={{ marginBottom: 16 }}>
        设置默认条款
      </Button>
      <TermsTable value={value} onChange={onChange} />
    </>
  );
};

export default QuoteTermsTab;
