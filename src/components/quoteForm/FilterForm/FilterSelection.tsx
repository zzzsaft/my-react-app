import { ProCard } from "@ant-design/pro-components";
import { Col, Form, Input, Row } from "antd";

const FilterSelection = () => (
  <ProCard
    title="过滤器选型"
    collapsible
    defaultCollapsed={false}
    style={{ marginBottom: 16 }}
    headerBordered
  >
    <Row gutter={16}>
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

export default FilterSelection;
