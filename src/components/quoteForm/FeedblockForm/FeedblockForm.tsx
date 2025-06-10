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

import { forwardRef, useImperativeHandle } from "react";
import ProForm, { ProFormDependency } from "@ant-design/pro-form";
import TextArea from "antd/es/input/TextArea";

import MaterialSelect from "../../general/MaterialSelect";
import AutoSlashInput from "../../general/AutoSlashInput";
import RatioInput from "../../general/RatioInput";
import ExtruderForm from "../formComponents/ExtruderForm";
import { PowerInput } from "../formComponents/PowerInput";
import { HeatingMethodSelect } from "../formComponents/HeatingMethodInput";
import ProFormListWrapper from "../formComponents/ProFormListWrapper";

interface PriceFormRef {
  form: FormInstance;
}

const FeedblockForm = forwardRef(
  ({ quoteId, quoteItemId }: { quoteId: number; quoteItemId: number }, ref) => {
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
      form,
    }));


    const countMap: Record<string, number> = {
      两台机: 2,
      三台机: 3,
      四台机: 4,
      五台机: 5,
      六台机: 6,
      七台机: 7,
      八台机: 8,
      九台机: 9,
    };


    const handleFieldsChange = (changedFields: any) => {
      if (changedFields.layers != null) {
        const map: Record<string, string[]> = {
          两层: ["两台机"],
          三层: ["两台机", "三台机"],
          五层: ["三台机", "四台机", "五台机"],
          七层: ["四台机", "五台机", "六台机", "七台机"],
          九层: ["五台机", "六台机", "七台机", "八台机", "九台机"],
        };
        const opts = map[changedFields.layers as string] || [];
        const current = form.getFieldValue("extruderNumber");
        if (current && !opts.includes(current)) {
          form.setFieldValue("extruderNumber", undefined);
        }
      }
      if (changedFields.extruderNumber != null) {
        const count = countMap[changedFields.extruderNumber as string];
        if (count) {
          const list = (form.getFieldValue("extruderModel") || []) as any[];
          const base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          const next = Array.from({ length: count }, (_, i) => ({ layer: base[i] }));
          form.setFieldValue(
            "extruderModel",
            list.slice(0, count).concat(next.slice(list.length))
          );
          form.setFieldValue(
            "compositeStructure",
            next.map((i) => ({ layer: i.layer }))
          );
          form.setFieldValue(
            "compositeRatio",
            next.map((i) => ({ layer: i.layer }))
          );
          form.setFieldValue("screwList", next);
        }
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

          <Row gutter={16}>

              <Col xs={24} md={12}>
                <Form.Item
                  name="material"
                  label="适用塑料原料"
                  rules={[{ required: true, message: "请选择适用原料" }]}
                >
                  <MaterialSelect />
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
              <Form.Item noStyle dependencies={["extruderNumber"]}>
                {({ extruderNumber }) => (
                  <Col xs={24} md={12}>
                    <ProFormListWrapper
                      name="compositeStructure"
                      label="层结构形式"
                      count={countMap[extruderNumber as string]}
                      canCreate={false}
                      canDelete={false}
                      formItems={
                        <Form.Item
                          name="structure"
                          label="结构"
                          rules={[{ required: true, message: "请输入层结构形式" }]}
                        >
                          <AutoSlashInput />
                        </Form.Item>
                      }
                    />
                  </Col>
                )}
              </Form.Item>
              <Form.Item noStyle dependencies={["extruderNumber"]}>
                {({ extruderNumber }) => (
                  <Col xs={24} md={12}>
                    <ProFormListWrapper
                      name="compositeRatio"
                      label="每层复合比例"
                      count={countMap[extruderNumber as string]}
                      canCreate={false}
                      canDelete={false}
                      rules={[
                        {
                          validator: async (_, value) => {
                            const sum = (value || []).reduce(
                              (t: number, c: any) => t + Number(c?.ratio || 0),
                              0
                            );
                            if (sum !== 100) {
                              return Promise.reject(new Error("比例和需为100%"));
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                      formItems={
                        <Row gutter={8}>
                          <Col span={10}>
                            <Form.Item name="layer" label="层">
                              <AutoComplete
                                disabled
                                options={"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                  .split("")
                                  .map((s) => ({ value: s }))}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={14}>
                            <Form.Item
                              name="ratio"
                              label="比例"
                              rules={[{ required: true, message: "请输入比例" }]}
                            >
                              <InputNumber
                                min={0}
                                max={100}
                                style={{ width: "100%" }}
                                formatter={(v) => `${v}%`}
                                parser={(v) => v?.replace(/%/g, "") as any}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      }
                    />
                  </Col>
                )}
              </Form.Item>
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
              <Form.Item noStyle dependencies={["material", "extruderNumber"]}>
                {({ material, extruderNumber }) => (
                  <Col span={24}>
                    <ExtruderForm
                      items={Array.isArray(material) ? material : material ? [material] : []}
                      count={countMap[extruderNumber as string]}
                      creatorButtonProps={false}
                    />
                  </Col>
                )}
              </Form.Item>
              <Col xs={24} md={12}>
                <Form.Item
                  name="extruderOrientation"
                  label="挤出机排列方向"
                  initialValue="按供方提供图纸确认回传为准"
                >
                  <AutoComplete
                    options={[{
                      label: "按供方提供图纸确认回传为准",
                      value: "按供方提供图纸确认回传为准",
                    }]}
                  />
                </Form.Item>
              </Col>
            </Row>
          <Form.Item label="其他备注" name="remark">
            <TextArea />
          </Form.Item>
        </ProForm>
      </>
    );
  }
);

export default FeedblockForm;
