import React from "react";
import TermsTable from "./TermsTable";
import { Clause } from "../../types/types";

interface QuoteTermsTabProps {
  value: Clause[];
  onChange: (terms: Clause[]) => void;
}

const QuoteTermsTab: React.FC<QuoteTermsTabProps> = ({ value, onChange }) => {
  return <TermsTable value={value} onChange={onChange} />;
};

export default QuoteTermsTab;
