import React from "react";
import { Form, Switch } from "antd";
import TermsTable from "./TermsTable";
import { Clause } from "../../types/types";

interface ContractTabProps {
  value: Clause[];
  onChange: (terms: Clause[]) => void;
}

const ContractTab: React.FC<ContractTabProps> = ({ value, onChange }) => {
  return (
    <>
      <Form.Item name="useCompanyContract" label="是否使用公司合同" valuePropName="checked">
        <Switch />
      </Form.Item>
      <TermsTable value={value} onChange={onChange} />
    </>
  );
};

export default ContractTab;
