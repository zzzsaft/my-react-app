import { ProCard } from "@ant-design/pro-components";
import { Col, Form, Input, Row, Select, FormInstance } from "antd";
import { FilterProduct } from "../../../types/types";

interface Props {
  form: FormInstance;
  filters: FilterProduct[];
}
const FilterSelection = ({ form, filters }: Props) => {
  const nameOptions = Array.from(new Set(filters.map((f) => f.name))).map((n) => ({
    label: n,
    value: n,
  }));

  return (
    <ProCard
      title="过滤器选型"
      collapsible
      defaultCollapsed={false}
      style={{ marginBottom: 16 }}
      headerBordered
    >
      <Row gutter={16}>
        <Col xs={12} md={6}>
          <Form.Item
            label="过滤器类型"
            name="name"
            rules={[{ required: true, message: "请选择过滤器类型" }]}
          >
            <Select options={nameOptions} allowClear />
          </Form.Item>
        </Col>
        <Form.Item noStyle dependencies={["name"]}>
          {({ getFieldValue }) => {
            const modelOptions = filters
              .filter((f) => f.name === getFieldValue("name"))
              .map((f) => ({ label: f.model, value: f.model }));

            return (
              <Col xs={12} md={6}>
                <Form.Item
                  label="型号"
                  name="model"
                  rules={[{ required: true, message: "请选择型号" }]}
                >
                  <Select options={modelOptions} allowClear />
                </Form.Item>
              </Col>
            );
          }}
        </Form.Item>
        <Col xs={12} md={6}>
          <Form.Item label="过滤网板" name="filterBoard">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item label="产能" name="production">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item label="轮廓尺寸" name="dimension">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item label="重量" name="weight">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item label="过滤直径" name="filterDiameter">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item label="有效过滤面积" name="effectiveFilterArea">
            <Input readOnly />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item label="承受压力" name="pressure">
            <Input readOnly />
          </Form.Item>
        </Col>
      </Row>
    </ProCard>
  );
};

export default FilterSelection;
