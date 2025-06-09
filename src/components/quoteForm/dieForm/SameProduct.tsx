import { Col, Form, Input, Radio, Row } from "antd";
import { useState } from "react";

export const SameProduct = () => {
  const [isBuySameProduct, setIsBuySameProduct] = useState<boolean>(false);
  const [isIntercompatible, setIsIntercompatible] = useState<boolean>(false);
  return (
    <Row gutter={16}>
      <Col xs={12} md={8}>
        <Form.Item
          name="isBuySameProduct"
          label="是否购买过相同型号产品"
          rules={[{ required: true, message: "是否购买过相同型号产品" }]}
        >
          <Radio.Group onChange={(e) => setIsBuySameProduct(e.target.value)}>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
      </Col>
      {isBuySameProduct ? (
        <Col xs={12} md={8}>
          <Form.Item
            name="lastProductCode"
            label="同型号产品编号"
            rules={[{ required: true, message: "请输入原产品名称编号" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      ) : (
        <Col xs={12} md={8}>
          <Form.Item
            name="isIntercompatible"
            label="是否与购买过的产品互配"
            rules={[{ required: true, message: "是否与原购买过的产品互配" }]}
          >
            <Radio.Group onChange={(e) => setIsIntercompatible(e.target.value)}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      )}
      {!isBuySameProduct && isIntercompatible && (
        <Col xs={12} md={8}>
          <Form.Item
            name="intercompatibleProductCode"
            label="互配产品编号"
            rules={[{ required: true, message: "请输入原产品名称编号" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      )}
    </Row>
  );
};
