import React from "react";
import { Form, Switch, Button } from "antd";
import TermsTable from "./TermsTable";
import { Clause } from "../../types/types";

interface ContractTabProps {
  value: Clause[];
  onChange: (terms: Clause[]) => void;
  onSetDefault: () => void;
}

const ContractTab: React.FC<ContractTabProps> = ({
  value,
  onChange,
  onSetDefault,
}) => {
  return (
    <>
      <Form.Item name="useCompanyContract" label="是否使用公司合同" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Button type="dashed" onClick={onSetDefault} style={{ marginBottom: 16 }}>
        设置默认条款
      </Button>
      <TermsTable value={value} onChange={onChange} />
    </>
  );
};

export default ContractTab;
