import { ProCard, ProFormDependency } from "@ant-design/pro-components";
import {
  Col,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Segmented,
  Select,
} from "antd";
import { IntervalInputFormItem } from "../../general/IntervalInput";
import { CustomSelect } from "../../general/CustomSelect";
import { useEffect, useState } from "react";
import ScrewForm from "../formComponents/ScrewForm";
import AutoSlashInput from "../../general/AutoSlashInput";
import RatioInput from "../../general/RatioInput";
import { MATERIAL } from "../../../util/MATERIAL";
import MaterialSelect from "../../general/MaterialSelect";
import { useProductStore } from "../../../store/useProductStore";
import ExtruderForm from "../formComponents/ExtruderForm";

export const ModelSelection = () => {
  const pump = useProductStore((state) => state.pump);
  const fetchPump = useProductStore((state) => state.fetchPump);
  useEffect(() => {
    if (pump.length == 0) {
      fetchPump();
    }
  }, []);
  const [runnerType, setRunnerType] = useState("");
  const [material, setMaterial] = useState([""]);

  return (
    <>
      <ProCard
        title="分配器型号选择"
        collapsible
        defaultCollapsed={false}
        style={{ marginBottom: 16 }}
        headerBordered
      >
        <Row gutter={16}>
          <Col xs={12} md={12}>
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
              name="production"
              label="适用产量(kg/h)"
              rules={[{ required: true, message: "请输入适用产量范围" }]}
              placeholder={"产量"}
              addonAfter="kg/h"
            />
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="分配器层数"
              name="type"
              rules={[{ required: true, message: "请选择分配器层数" }]}
            >
              <Segmented<string>
                options={["两层", "三层", "五层", "七层", "九层"]}
              />
            </Form.Item>
          </Col>
          <Form.Item noStyle dependencies={["type"]}>
            {({ getFieldValue }) => {
              const type = getFieldValue("type");
              let option = [...new Set(pump.map((p) => p.model))].map(
                (model) => ({ label: model, value: model })
              );
              if (type == "内冷式计量泵") {
                option = option.map((o) => ({
                  label: o.label + "-NL",
                  value: o.value + "-NL",
                }));
              }
              return (
                <Col xs={24} md={12}>
                  <Form.Item
                    label="型号"
                    name="型号"
                    rules={[{ required: true, message: "请选择型号" }]}
                  >
                    <Select options={option} />
                  </Form.Item>
                </Col>
              );
            }}
          </Form.Item>
        </Row>
        <Row gutter={16}>
          <Col xs={12} md={6}>
            <Form.Item label="排量" name="pumpage">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="转速" name="rotateSpeed">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="产量" name="production">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="加热功率" name="heatingPower">
              <Input readOnly />
            </Form.Item>
          </Col>

          <ExtruderForm items={material} />
        </Row>
      </ProCard>
    </>
  );
};
