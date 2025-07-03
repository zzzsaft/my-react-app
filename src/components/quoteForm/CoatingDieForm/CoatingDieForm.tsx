import { forwardRef, useImperativeHandle } from "react";
import { Form, FormInstance } from "antd";
import ProForm from "@ant-design/pro-form";
import BasicInfo from "./BasicInfo";
import LiquidInfo from "./LiquidInfo";
import ProcessInfo from "./ProcessInfo";

export interface CoatingDieFormRef {
  form: FormInstance;
}

const CoatingDieForm = forwardRef<CoatingDieFormRef, { quoteId: number; quoteItemId: number; readOnly?: boolean }>(
  ({ readOnly = false }, ref) => {
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
      form,
    }));

    return (
      <ProForm layout="vertical" form={form} submitter={false} disabled={readOnly}>
        <BasicInfo />
        <LiquidInfo />
        <ProcessInfo />
      </ProForm>
    );
  }
);

export default CoatingDieForm;
