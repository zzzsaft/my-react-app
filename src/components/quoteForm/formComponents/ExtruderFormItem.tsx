import ProForm from "@ant-design/pro-form";
import { AutoComplete, Col, Form, InputNumber, Row, Select } from "antd";
import { DefaultOptionType } from "antd/es/select";

export const ExtruderFormItem = ({ items }: { items: string[] }) => {
  return (
    <Row gutter={16}>
      <Col xs={4} sm={3}>
        {/* 1. 层级 (AutoComplete) */}
        <ProForm.Item
          name={"layer"}
          label="层"
          rules={[{ required: true, message: "请选择层" }]}
        >
          <AutoComplete
            // disabled={true}
            options={["A", "B", "C", "D", "E", "F"].map((item) => ({
              value: item,
              label: item,
            }))}
            placeholder="层"
            filterOption={(inputValue, option) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
        </ProForm.Item>
      </Col>
      <Col xs={10} sm={5}>
        <ProForm.Item
          name={"material"}
          label="原料"
          rules={[{ required: true, message: "请选择原料" }]}
        >
          <Select
            options={items.map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </ProForm.Item>
      </Col>

      <Col xs={10} sm={5}>
        <ProForm.Item name="diameter" label="直径">
          <InputNumber addonBefore="Φ" min={0} precision={0} controls={false} />
        </ProForm.Item>
      </Col>
      <Col xs={12} sm={5}>
        <ProForm.Item name="extruderModel" label="挤出机型号">
          <AutoComplete
            options={[
              { label: "单螺杆挤出机", value: "单螺杆挤出机" },
              { label: "双螺杆挤出机", value: "双螺杆挤出机" },
            ]}
          />
        </ProForm.Item>
      </Col>
      <Col xs={12} sm={5}>
        <ProForm.Item name="output" label="产量">
          <InputNumber
            min={0}
            precision={0}
            controls={false}
            addonAfter={"kg/h"}
          />
        </ProForm.Item>
      </Col>
    </Row>
  );
};
