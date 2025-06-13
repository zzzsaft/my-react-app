import {
  ProCard,
  ProForm,
  ProFormDependency,
} from "@ant-design/pro-components";
import { Col, Form, Input, InputNumber, Radio, Row } from "antd";
import { IntervalInputFormItem } from "../../general/IntervalInput";
import { CustomSelect } from "../../general/CustomSelect";
import ScrewForm from "../formComponents/ScrewForm";
import AutoSlashInput from "../../general/AutoSlashInput";
import ProFormListWrapper from "../formComponents/ProFormListWrapper";
import LevelInputNumber, { LevelValue } from "../../general/LevelInputNumber";
import MaterialSelect from "../../general/MaterialSelect";

const RUNNER_NUMBER_OPTIONS = {
  流道形式: ["单腔流道", "模内共挤", "分配器共挤", "分配器+模内共挤"],
};
export const Product = () => {
  const form = Form.useFormInstance();
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
              <MaterialSelect />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <IntervalInputFormItem
              name="productWidth"
              label="制品宽度(mm)"
              // rules={[{ required: true, message: "请输入有效厚度范围" }]}
              placeholder={"制品宽度"}
              unit="mm"
              // unit="mm"
            />
          </Col>
          <Col xs={12} md={6}>
            <IntervalInputFormItem
              name="dieWidth"
              label="口模有效宽度(mm)"
              rules={[{ required: true, message: "请输入有效宽度范围" }]}
              placeholder={"有效宽度"}
              unit="mm"
              // addonAfter="mm"
              isSecondNumberGreater={false}
            />
          </Col>
          <Col xs={12} md={6}>
            <IntervalInputFormItem
              name="thickness"
              label="制品厚度(mm)"
              dependencies={["lipOpening"]}
              rules={[
                {
                  validator: (_, value) => {
                    const other = form.getFieldValue("lipOpening");
                    if (!value?.value && !other?.value) {
                      return Promise.reject(
                        new Error("制品厚度和模唇开口至少要填一个")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              placeholder={"有效厚度"}
              unit="mm"
            />
          </Col>
          <Col xs={12} md={6}>
            <IntervalInputFormItem
              name="lipOpening"
              label="模唇开口(mm)"
              dependencies={["thickness"]}
              rules={[
                {
                  validator: (_, value) => {
                    const other = form.getFieldValue("thickness");
                    if (!value?.value && !other?.value) {
                      return Promise.reject(
                        new Error("制品厚度和模唇开口至少要填一个")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              placeholder={"模唇开口"}
              unit="mm"
            />
          </Col>
          <Col xs={12} md={6}>
            <IntervalInputFormItem
              name="production"
              label="适用产量(kg/h)"
              rules={[{ required: true, message: "请输入适用产量范围" }]}
              placeholder={"产量"}
              unit="kg/h"
            />
          </Col>

          <Col xs={12} md={6}>
            <IntervalInputFormItem
              name="temperature"
              label="工艺温度(℃)"
              rules={[{ required: true, message: "请输入工艺温度" }]}
              placeholder={"工艺温度"}
              unit="℃"
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
                showSearch={false}
                dropdown={false}
                initialGroups={RUNNER_NUMBER_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Form.Item noStyle dependencies={["runnerType"]}>
            {({ getFieldValue }) =>
              getFieldValue("runnerType")?.includes("模内共挤") ? (
                <>
                  <Col xs={12} md={6}>
                    <Form.Item
                      name="runnerNumber"
                      label="模内共挤层数"
                      rules={[
                        { required: true, message: "请输入模内共挤层数" },
                      ]}
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
                  <Col xs={24} md={24}>
                    <ProFormDependency name={["compositeStructure"]}>
                      {({ compositeStructure }) => (
                        <ProFormListWrapper
                          name="compositeRatio"
                          label="每层复合比例"
                          canCreate={false}
                          canDelete={false}
                          isHorizontal
                          formItems={
                            <ProForm.Item
                              name={[]}
                              rules={[
                                {
                                  validator: async (
                                    _: any,
                                    value: LevelValue
                                  ) => {
                                    const num = parseFloat(
                                      value?.value?.value || "0"
                                    );
                                    if (isNaN(num) || num === 0) {
                                      return Promise.reject(
                                        new Error("比例不得为0")
                                      );
                                    }
                                    if (
                                      (value?.value?.front &&
                                        value?.value?.front >= 100) ||
                                      (value?.value?.rear &&
                                        value?.value?.rear >= 100)
                                    ) {
                                      return Promise.reject(
                                        new Error("比例不得超过100")
                                      );
                                    }
                                    if (
                                      value?.value?.front &&
                                      value?.value?.rear &&
                                      value?.value?.front >= value?.value?.rear
                                    ) {
                                      return Promise.reject(
                                        new Error("第一个应比第二个小")
                                      );
                                    }
                                    return Promise.resolve();
                                  },
                                },
                              ]}
                            >
                              <LevelInputNumber style={{ width: 120 }} />
                            </ProForm.Item>
                          }
                        />
                      )}
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
              ) : null
            }
          </Form.Item>
        </Row>
      </ProCard>
      <Form.Item noStyle dependencies={["runnerType", "material"]}>
        {({ getFieldValue }) =>
          getFieldValue("runnerType")?.includes("模内共挤") ? (
            <ProCard
              title="螺杆信息"
              collapsible
              defaultCollapsed={false}
              style={{ marginBottom: 16 }}
              headerBordered
            >
              <ScrewForm
                items={
                  Array.isArray(getFieldValue("material"))
                    ? getFieldValue("material")
                    : [getFieldValue("material")]
                }
              />
            </ProCard>
          ) : null
        }
      </Form.Item>
    </>
  );
};
