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

interface PartFormRef {
  form: FormInstance;
}

interface PartFormProps {
  readOnly?: boolean;
}

const PartForm = forwardRef<PartFormRef, PartFormProps>(
  ({ readOnly = false }, ref) => {
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
      form,
    }));

    return (
      <ProForm layout="vertical" form={form} submitter={false}>
        <ProFormList
          readonly={readOnly}
          name="parts"
          label="配件明细"
          creatorButtonProps={{ creatorButtonText: "新增物料" }}
          deleteIconProps={readOnly ? false : undefined}
          copyIconProps={readOnly ? false : undefined}
          alwaysShowItemLabel
          rules={[
            {
              required: true,
              message: "请至少输入一个配件",
              validator: (_, value) => {
                if (value.length == 0) {
                  return Promise.reject(
                    new Error("制品厚度和模唇开口至少要填一个")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {(f, index, action) => (
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <ProForm.Item
                  name={"name"}
                  label="名称"
                  rules={[{ required: true, message: "请输入物料名称" }]}
                >
                  <AutoComplete
                    options={[]}
                    style={{ width: "100%" }}
                    placeholder="物料名称"
                  />
                </ProForm.Item>
              </Col>
              <Col xs={12} md={3}>
                <ProForm.Item
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
                </ProForm.Item>
              </Col>
              <Col xs={12} md={3}>
                <ProForm.Item
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
                </ProForm.Item>
              </Col>
              <Col xs={12} md={4}>
                <ProForm.Item
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
                </ProForm.Item>
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
            const parts = getFieldValue("parts") || [];
            const total = parts.reduce((sum: number, g: any) => {
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
  }
);

export default PartForm;
