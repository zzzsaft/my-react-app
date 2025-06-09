import { ProCard, ProFormDependency } from "@ant-design/pro-components";
import { Col, Form, Input, InputNumber, Radio, Row } from "antd";
import { IntervalInputFormItem } from "../../general/IntervalInput";
import { CustomSelect } from "../../general/CustomSelect";
import { useState } from "react";
import ScrewForm from "../formComponents/ScrewForm";
import AutoSlashInput from "../../general/AutoSlashInput";
import RatioInput from "../../general/RatioInput";
import MaterialSelect from "../../general/MaterialSelect";

const RUNNER_NUMBER_OPTIONS = {
  流道形式: ["单腔流道", "模内共挤", "分配器共挤", "分配器+模内共挤"],
};
export const Product = () => {
  const [runnerType, setRunnerType] = useState("");
  const [material, setMaterial] = useState([""]);

  return (
    <>
      <ProCard
        title="制品信息"
        collapsible
        defaultCollapsed={false}
        style={{ marginBottom: 16 }}
        headerBordered
      >
        <Form.Item
          label="请选择原料来源"
          name="materialSource"
          rules={[{ required: true, message: "请选择原料来源" }]}
        >
          <Radio.Group>
            <Radio value={"乙方提供各原料样品流变曲线"}>
              乙方提供各原料样品流变曲线
            </Radio>
            <Radio value={"甲方提供各原料样品500g供乙方检测"}>
              甲方提供各原料样品500g供乙方检测
            </Radio>
            <Radio value={"NA"}>无需提供</Radio>
          </Radio.Group>
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={19}>
            {/* 适用原料 */}
            <Form.Item
              name="material"
              label="适用原料"
              rules={[{ required: true, message: "请选择适用原料" }]}
            >
              <MaterialSelect
                onChange={(value) => {
                  setMaterial(Array.isArray(value) ? value : [value]);
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <IntervalInputFormItem
              name="productWidth"
              label="制品宽度(mm)"
              // rules={[{ required: true, message: "请输入有效厚度范围" }]}
              placeholder={"制品宽度"}
              addonAfter="mm"
            />
          </Col>
          <Col xs={12} md={6}>
            <IntervalInputFormItem
              name="dieWidth"
              label="口模有效宽度(mm)"
              rules={[{ required: true, message: "请输入有效宽度范围" }]}
              placeholder={"有效宽度"}
              addonAfter="mm"
              isSecondNumberGreater={false}
            />
          </Col>
          <Col xs={12} md={6}>
            <IntervalInputFormItem
              name="thickness"
              label="制品厚度(mm)"
              rules={[{ required: true, message: "请输入有效厚度范围" }]}
              placeholder={"有效厚度"}
              addonAfter="mm"
            />
          </Col>
          <Col xs={12} md={6}>
            <IntervalInputFormItem
              name="production"
              label="适用产量(kg/h)"
              rules={[{ required: true, message: "请输入适用产量范围" }]}
              placeholder={"产量"}
              addonAfter="kg/h"
            />
          </Col>

          <Col xs={12} md={6}>
            <IntervalInputFormItem
              name="temperature"
              label="工艺温度(℃)"
              rules={[{ required: true, message: "请输入工艺温度" }]}
              placeholder={"工艺温度"}
              addonAfter="℃"
            />
          </Col>
          <Col xs={12} md={6}>
            {/* 5. 流道数量 */}
            <Form.Item
              name="runnerType"
              label="流道形式"
              rules={[{ required: true, message: "请选择流道数量" }]}
            >
              <CustomSelect
                onChange={(value) => {
                  setRunnerType(value as string);
                }}
                showSearch={false}
                dropdown={false}
                initialGroups={RUNNER_NUMBER_OPTIONS}
              />
            </Form.Item>
          </Col>
          {runnerType.includes("模内共挤") && (
            <>
              <Col xs={12} md={6}>
                <Form.Item
                  name="runnerNumber"
                  label="模内共挤层数"
                  rules={[{ required: true, message: "请输入模内共挤层数" }]}
                >
                  <InputNumber min={2} max={6} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item
                  name="compositeStructure"
                  label="复合结构"
                  rules={[{ required: true, message: "请输入复合结构" }]}
                >
                  <AutoSlashInput />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <ProFormDependency name={["compositeStructure"]}>
                  {({ compositeStructure }) => {
                    return (
                      <Form.Item
                        name="compositeRatio"
                        label="复合比例"
                        rules={[
                          { required: true, message: "请输入复合比例" },
                          {
                            validator: (_, value) => {
                              const length1 = value?.split(":").length;
                              const length2 =
                                compositeStructure?.split("").length;
                              if (length1 != length2) {
                                return Promise.reject(
                                  new Error("复合比例与复合结构数量不匹配")
                                );
                              }

                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <RatioInput />
                      </Form.Item>
                    );
                  }}
                </ProFormDependency>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item
                  name="haveThermalInsulation"
                  label="是否选配隔热装置"
                  rules={[{ required: true, message: "是否选配隔热装置" }]}
                >
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
      </ProCard>
      {runnerType.includes("模内共挤") && (
        <ProCard
          title="螺杆信息"
          collapsible
          defaultCollapsed={false}
          style={{ marginBottom: 16 }}
          headerBordered
        >
          <ScrewForm items={material} />
        </ProCard>
      )}
    </>
  );
};
