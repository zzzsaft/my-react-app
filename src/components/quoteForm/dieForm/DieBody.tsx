import { ProCard, ProFormDependency } from "@ant-design/pro-components";
import { Badge, Col, Form, Radio, Row, InputNumber } from "antd";
import { MATERIAL_OPTIONS } from "@/util/MATERIAL";
import { CustomSelect } from "@/components/general/CustomSelect";
import { AutoCompleteInput } from "@/components/general/AutoCompleteInput";
import { IntervalInputFormItem } from "@/components/general/IntervalInput";
import ProFormListWrapper from "../formComponents/ProFormListWrapper";

// 常量定义
const UPPER_LIP_OPTIONS = {
  手动: ["手动差动推式", "手动全推式", "手动推拉式", "手动减力推拉式"],
  自动: ["自动全推式", "自动推拉式"],
  其他: ["上模整体结构"],
};

const LOWER_LIP_OPTIONS = {
  下模唇: ["下模整体结构", "下模固定可拆卸", "下模可预粗调", "下模快速开口"],
};

const WIDTH_ADJUSTMENT_OPTIONS = {
  无挡块: ["不可调节"],
  外挡: [
    "外挡（技术设计）",
    "开槽外挡",
    "挂钩外挡",
    "手动丝杆外挡",
    "电动丝杆外挡",
    "齿轮调节外挡",
  ],
  内挡: ["固定式内挡", "手动丝杆内挡", "电动丝杆内挡"],
  其他: ["不锈钢垫片"],
};

const FINE_TUNING_OPTIONS = [
  { label: "19", value: "19" },
  { label: "21", value: "21" },
  { label: "25.4-默认", value: "25.4" },
  { label: "28.5", value: "28.5" },
  { label: "30", value: "30" },
];

const UPPER_OPTIONS = [
  { label: "无阻流棒", value: "无阻流棒" },
  { label: "45°阻流棒", value: "45°阻流棒" },
  { label: "70°阻流棒", value: "70°阻流棒" },
  { label: "90°阻流棒", value: "90°阻流棒" },
  // { label: "其他", value: "other", showInput: true },
];

const LOWER_OPTIONS = [
  { label: "无阻流棒", value: "无阻流棒" },
  { label: "90°阻流棒", value: "90°阻流棒" },
  // { label: "其他", value: "other", showInput: true },
];

export const DieBody = () => {
  return (
    <ProCard
      title="模体配置"
      collapsible
      defaultCollapsed={false}
      style={{ marginBottom: 16 }}
      headerBordered
    >
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="dieMaterial"
            label="模体材质"
            rules={[{ required: true, message: "请选择模体材质" }]}
          >
            <CustomSelect
              initialGroups={MATERIAL_OPTIONS}
              dropdown={true}
              showSearch={false}
            />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          {/* 3. 宽幅调节方式 */}
          <Form.Item
            name="widthAdjustment"
            label="宽幅调节方式"
            rules={[{ required: true, message: "请选择宽幅调节方式" }]}
          >
            <CustomSelect
              initialGroups={WIDTH_ADJUSTMENT_OPTIONS}
              dropdown={false}
            />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          {/* 1. 上模唇结构 */}
          <Form.Item
            name="upperLipStructure"
            label="上模唇结构"
            rules={[{ required: true, message: "请选择上模唇结构" }]}
          >
            <CustomSelect initialGroups={UPPER_LIP_OPTIONS} dropdown={false} />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          {/* 2. 下模唇结构 */}
          <Form.Item
            name="lowerLipStructure"
            label="下模唇结构"
            rules={[{ required: true, message: "请选择下模唇结构" }]}
          >
            <CustomSelect initialGroups={LOWER_LIP_OPTIONS} dropdown={false} />
          </Form.Item>
        </Col>

        <Col xs={12} md={6}>
          {/* 4. 微调间距 */}
          <Form.Item
            name="fineTuningSpacing"
            label="微调间距"
            rules={[
              { required: true, message: "请选择微调间距" },
              {
                // required: true,
                warningOnly: true,
                validator(_, value) {
                  if (
                    value &&
                    !FINE_TUNING_OPTIONS.map((i) => i.value).includes(
                      value.toString()
                    )
                  ) {
                    return Promise.reject(`${value}mm属于定制微调间距`);
                  }
                  return Promise.resolve();
                },
              },
            ]}
            initialValue={25.4}
          >
            <AutoCompleteInput
              options={FINE_TUNING_OPTIONS}
              placeholder="请选择微调间距"
            />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item
            name="topFlowRestrictor"
            label="上模阻流棒"
            rules={[
              { required: true, message: "请选择上模阻流棒" },
              // ...RadioWithInputRules,
            ]}
          >
            <AutoCompleteInput
              options={UPPER_OPTIONS}
              placeholder="上模阻流棒"
              type="text"
              addonAfter={null}
            />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item
            name="bottomFlowRestrictor"
            label="下模阻流棒"
            rules={[{ required: true, message: "请选择下模阻流棒" }]}
          >
            <AutoCompleteInput
              options={LOWER_OPTIONS}
              placeholder="下模阻流棒"
              type="text"
              addonAfter={null}
              // disabled={true}
            />
          </Form.Item>
        </Col>
        <Form.Item noStyle dependencies={["lowerLipStructure"]}>
          {({ getFieldValue }) =>
            getFieldValue("lowerLipStructure")?.includes("整体") ? null : (
              <Col xs={12} md={6}>
                <Form.Item
                  name="lipCount"
                  label="模唇数量"
                  rules={[{ required: true, message: "请输入模唇数量" }]}
                  initialValue={1}
                >
                  <InputNumber min={1} max={5} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            )
          }
        </Form.Item>
        <Col xs={24} md={24}>
          <ProFormDependency name={["lipCount"]}>
            {({ lipCount }) =>
              lipCount > 1 ? (
                <ProFormListWrapper
                  name="lipThicknessRange"
                  // rules={[{ require: true }]}
                  label="模唇厚度范围"
                  canCreate={false}
                  canDelete={false}
                  min={lipCount}
                  max={lipCount}
                  isHorizontal
                  formItems={
                    <IntervalInputFormItem
                      name={[]}
                      rules={[{ required: true, message: "请输入厚度范围" }]}
                      unit="mm"
                    />
                  }
                />
              ) : null
            }
          </ProFormDependency>
        </Col>
        <Col xs={12} md={8}>
          <Form.Item
            name="smartRegulator"
            label={
              <span>
                是否搭配智能调节器{" "}
                <span
                  style={{
                    color: "#ff4d4f",
                    fontSize: 12,
                    // paddingBottom: "100px",
                  }}
                >
                  NEW
                </span>
              </span>
            }
            rules={[{ required: true, message: "是否与原购买过的产品互配" }]}
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col xs={12} md={8}>
          <Form.Item
            name="thicknessGauge"
            label="是否选配测厚仪"
            rules={[{ required: true, message: "是否选配测厚仪" }]}
            initialValue={false}
          >
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </ProCard>
  );
};
