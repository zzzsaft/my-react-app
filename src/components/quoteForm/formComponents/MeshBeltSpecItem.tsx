import { AutoCompleteInput } from "@/components/general/AutoCompleteInput";
import ProForm from "@ant-design/pro-form";
import { Row, Col, InputNumber, Layout } from "antd";

const MeshBeltSpecItem: React.FC = () => {
  return (
    <Row gutter={16}>
      <Col xs={12} md={6}>
        <ProForm.Item
          name="mesh"
          label="目"
          rules={[{ required: true, message: "请输入目数" }]}
          initialValue={120}
          layout="vertical"
        >
          <AutoCompleteInput
            options={[80, 120, 150].map((n) => ({
              label: String(n),
              value: String(n),
            }))}
          />
        </ProForm.Item>
      </Col>
      <Col xs={12} md={6}>
        <ProForm.Item
          name="length"
          label="长度"
          rules={[{ required: true, message: "请输入长度" }]}
          initialValue={10}
          layout="vertical"
        >
          <AutoCompleteInput addonAfter="米" />
        </ProForm.Item>
      </Col>
      <Col xs={12} md={6}>
        <ProForm.Item
          name="width"
          label="宽度"
          rules={[{ required: true, message: "请输入宽度" }]}
          layout="vertical"
        >
          <AutoCompleteInput addonAfter="mm" />
        </ProForm.Item>
      </Col>
      <Col xs={12} md={6}>
        <ProForm.Item
          name="quantity"
          label="数量"
          rules={[{ required: true, message: "请输入数量" }]}
          initialValue={1}
          layout="vertical"
        >
          <InputNumber min={1} addonAfter="卷" style={{ width: "100%" }} />
        </ProForm.Item>
      </Col>
    </Row>
  );
};

export default MeshBeltSpecItem;
