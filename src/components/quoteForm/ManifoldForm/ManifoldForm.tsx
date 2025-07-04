import { Col, Form, FormInstance, InputNumber, Row, Select } from "antd";
import ProForm from "@ant-design/pro-form";
import { forwardRef, useImperativeHandle } from "react";
import RatioInput from "@/components/general/RatioInput";

export interface ManifoldFormProps {
  quoteId?: number;
  quoteItemId?: number;
  readOnly?: boolean;
}

const options = [
  { label: "需方客户提供图纸", value: "需方客户提供图纸" },
  { label: "供方精诚设计图纸", value: "供方精诚设计图纸" },
  { label: "按原图纸", value: "按原图纸" },
];

const ManifoldForm = forwardRef(
  (
    {
      quoteId,
      quoteItemId,
      readOnly = false,
    }: { quoteId: number; quoteItemId: number; readOnly?: boolean },
    ref
  ) => {
    const [form] = Form.useForm();
    useImperativeHandle(ref, () => ({
      form,
    }));

    return (
      <ProForm
        layout="vertical"
        form={form}
        submitter={false}
      >
        <Row gutter={16}>
          <Col xs={12} md={6}>
            <Form.Item
              label="加热分区"
              name="heatingZone"
              rules={[{ required: true, message: "请输入加热分区" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item
              label="复合比例"
              name="compoundRatio"
              initialValue="1:1:1"
              rules={[{ required: true, message: "请输入复合比例" }]}
            >
              <RatioInput />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item
              label="合流器图纸"
              name="blueprint"
              rules={[{ required: true, message: "请选择合流器图纸" }]}
            >
              <Select options={options} allowClear />
            </Form.Item>
          </Col>
        </Row>
      </ProForm>
    );
  }
);

export default ManifoldForm;
