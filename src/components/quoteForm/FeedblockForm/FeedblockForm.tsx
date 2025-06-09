import {
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Radio,
  Row,
  Segmented,
  Select,
  AutoComplete,
} from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import ProForm, { ProCard, ProFormDependency } from "@ant-design/pro-form";
import TextArea from "antd/es/input/TextArea";

import MaterialSelect from "../../general/MaterialSelect";
import AutoSlashInput from "../../general/AutoSlashInput";
import RatioInput from "../../general/RatioInput";
import ExtruderForm from "../formComponents/ExtruderForm";
import { PowerInput } from "../formComponents/PowerInput";
import { HeatingMethodSelect } from "../formComponents/HeatingMethodInput";

interface PriceFormRef {
  form: FormInstance;
}

const FeedblockForm = forwardRef(
  ({ quoteId, quoteItemId }: { quoteId: number; quoteItemId: number }, ref) => {
    const [form] = Form.useForm();
    const [material, setMaterial] = useState<string[]>([]);

    useImperativeHandle(ref, () => ({
      form,
    }));


    const handleFieldsChange = (changedFields: any) => {
      if (changedFields.compositeStructure != null) {
        const structs = changedFields.compositeStructure.split("");
        const list = structs.map((s: any) => ({ layer: s }));
        form.setFieldValue("screwList", list);
      }
    };

    return (
      <>
        <ProForm
          layout="vertical"
          form={form}
          submitter={false}
          onValuesChange={handleFieldsChange}
        >
          <ProCard
            title="共挤复合分配器配置"
            collapsible
            defaultCollapsed={false}
            style={{ marginBottom: 16 }}
            headerBordered
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="material"
                  label="适用塑料原料"
                  rules={[{ required: true, message: "请选择适用原料" }]}
                >
                  <MaterialSelect
                    onChange={(v) => setMaterial(Array.isArray(v) ? v : [v])}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="production"
                  label="产量(kg/h)"
                  rules={[{ required: true, message: "请输入产量" }]}
                >
                  <InputNumber min={0} precision={0} style={{ width: "100%" }} addonAfter="kg/h" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="structure"
                  label="分配器结构"
                  rules={[{ required: true, message: "请选择分配器结构" }]}
                >
                  <Radio.Group>
                    <Radio value="镶块式">镶块式</Radio>
                    <Radio value="摆叶式">摆叶式</Radio>
                    <Radio value="芯棒式">芯棒式</Radio>
                    <Radio value="精诚设计">精诚设计</Radio>
                    <Radio value="特殊定制">特殊定制</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Form.Item noStyle dependencies={["structure"]}>
                {({ getFieldValue }) =>
                  getFieldValue("structure") === "特殊定制" ? (
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="customStructure"
                        label="特殊定制说明"
                        rules={[{ required: true, message: "请输入定制内容" }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  ) : null
                }
              </Form.Item>
              <Col xs={24} md={12}>
                <Form.Item
                  name="layers"
                  label="分配器层数"
                  rules={[{ required: true, message: "请选择分配器层数" }]}
                >
                  <Segmented<string> options={["两层", "三层", "五层", "七层", "九层"]} />
                </Form.Item>
              </Col>
              <Form.Item noStyle dependencies={["layers"]}>
                {({ getFieldValue }) => {
                  const layer = getFieldValue("layers");
                  const map: Record<string, string[]> = {
                    两层: ["两台机"],
                    三层: ["两台机", "三台机"],
                    五层: ["三台机", "四台机", "五台机"],
                    七层: ["四台机", "五台机", "六台机", "七台机"],
                    九层: ["五台机", "六台机", "七台机", "八台机", "九台机"],
                  };
                  const opts = map[layer as string] || [];
                  return (
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="extruderNumber"
                        label="挤出机数量"
                        rules={[{ required: true, message: "请选择挤出机数量" }]}
                      >
                        <Select options={opts.map((i) => ({ label: i, value: i }))} />
                      </Form.Item>
                    </Col>
                  );
                }}
              </Form.Item>
              <Col xs={24} md={12}>
                <Form.Item
                  name="compositeStructure"
                  label="层结构形式"
                  rules={[{ required: true, message: "请输入层结构形式" }]}
                >
                  <AutoSlashInput />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <ProFormDependency name={["compositeStructure"]}>
                  {({ compositeStructure }) => (
                    <Form.Item
                      name="compositeRatio"
                      label="每层复合比例"
                      rules={[
                        { required: true, message: "请输入复合比例" },
                        {
                          validator: (_, value) => {
                            const l1 = value?.split(":").length;
                            const l2 = compositeStructure?.split("").length;
                            if (l1 !== l2) {
                              return Promise.reject(new Error("复合比例与层数不匹配"));
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <RatioInput />
                    </Form.Item>
                  )}
                </ProFormDependency>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="fastener"
                  label="紧固件（螺丝）"
                  rules={[{ required: true, message: "请选择螺丝" }]}
                  initialValue="12.9高强度"
                >
                  <AutoComplete options={[{ label: "12.9高强度", value: "12.9高强度" }]} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="power"
                  label="电压"
                  rules={[{ required: true, message: "请输入电压" }]}
                >
                  <PowerInput />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="heatingPower"
                  label="加热功率"
                  rules={[{ required: true, message: "请输入加热功率" }]}
                >
                  <InputNumber min={0} precision={0} style={{ width: "100%" }} addonAfter="kw" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="heatingMethod"
                  label="加热方式"
                  rules={[{ required: true, message: "请选择加热方式" }]}
                >
                  <HeatingMethodSelect />
                </Form.Item>
              </Col>
              <Col span={24}>
                <ExtruderForm items={material} />
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="extruderOrientation"
                  label="挤出机排列方向"
                  initialValue="按供方提供图纸确认回传为准"
                >
                  <AutoComplete options={[{ label: "按供方提供图纸确认回传为准", value: "按供方提供图纸确认回传为准" }]} />
                </Form.Item>
              </Col>
            </Row>
          </ProCard>
          <Form.Item label="其他备注" name="remark">
            <TextArea />
          </Form.Item>
        </ProForm>
      </>
    );
  }
);

export default FeedblockForm;
