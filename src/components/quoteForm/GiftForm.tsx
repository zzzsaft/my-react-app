import {
  AutoComplete,
  Col,
  Form,
  FormInstance,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";
import ProForm, { ProFormList, ProFormDependency } from "@ant-design/pro-form";
import { forwardRef, useImperativeHandle } from "react";
import { formatPrice } from "../../util/valueUtil";

interface GiftFormRef {
  form: FormInstance;
}

const GiftForm = forwardRef<GiftFormRef>((props, ref) => {
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    form,
  }));

  return (
    <ProForm layout="vertical" form={form} submitter={false}>
      <ProFormList
        name="gifts"
        label="赠品明细"
        creatorButtonProps={{ creatorButtonText: "新增赠品" }}
        alwaysShowItemLabel
      >
        {(f, index, action) => (
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="name"
                label="赠品名称"
                rules={[{ required: true, message: "请输入赠品名称" }]}
              >
                <AutoComplete options={[]} placeholder="赠品名称" />
              </Form.Item>
            </Col>
            <Col xs={12} md={3}>
              <Form.Item
                name="quantity"
                label="数量"
                rules={[{ required: true, message: "请输入数量" }]}
                initialValue={1}
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  controls={false}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={3}>
              <Form.Item
                name="unit"
                label="单位"
                rules={[{ required: true, message: "请选择单位" }]}
                initialValue="件"
              >
                <Select style={{ width: "100%" }}>
                  <Select.Option value="件">件</Select.Option>
                  <Select.Option value="套">套</Select.Option>
                  <Select.Option value="个">个</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item
                name="unitPrice"
                label="单价"
                rules={[{ required: true, message: "请输入单价" }]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  controls={false}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <ProFormDependency name={["quantity", "unitPrice"]}>
                {({ quantity, unitPrice }) => (
                  <Form.Item label="合计">
                    <Typography.Text strong>
                      {quantity && unitPrice
                        ? `¥ ${formatPrice(quantity * unitPrice)}`
                        : 0}
                    </Typography.Text>
                  </Form.Item>
                )}
              </ProFormDependency>
            </Col>
          </Row>
        )}
      </ProFormList>
      <Form.Item shouldUpdate>
        {({ getFieldValue }) => {
          const gifts = getFieldValue("gifts") || [];
          const total = gifts.reduce((sum: number, g: any) => {
            const q = g?.quantity;
            const p = g?.unitPrice;
            if (q && p) return sum + q * p;
            return sum;
          }, 0);
          return (
            <Typography.Text strong>
              总计：¥ {formatPrice(total || 0)}
            </Typography.Text>
          );
        }}
      </Form.Item>
    </ProForm>
  );
});

export default GiftForm;
