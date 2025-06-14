import { AutoComplete, Col, Form, InputNumber, Radio, Row } from "antd";

import ProForm from "@ant-design/pro-form";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { IntervalInputFormItem } from "@/general/IntervalInput";
import MaterialSelect from "@/general/MaterialSelect";
import { PowerInput } from "../formComponents/PowerInput";
import { HeatingMethodSelect } from "../formComponents/HeatingMethodInput";
import { useProductStore } from "@/store/useProductStore";
import { useQuoteStore } from "@/store/useQuoteStore";
import useProductActionModal from "@/hook/showProductActionModal";

import FilterSelection from "./FilterSelection";
import TextArea from "antd/es/input/TextArea";
import MeshBeltControlCard from "./MeshBeltControlCard";
import { ProCard } from "@ant-design/pro-components";

const FilterForm = forwardRef(
  (
    {
      quoteId,
      quoteItemId,
      readOnly = false,
    }: { quoteId: number; quoteItemId: number; readOnly?: boolean },
    ref
  ) => {
    const [form] = Form.useForm();
    const filters = useProductStore((state) => state.filter);
    const fetchFilter = useProductStore((state) => state.fetchFilter);

    const quoteItems = useQuoteStore
      .getState()
      .quotes.find((q) => q.id === quoteId)?.items;
    const { showProductActionModal } = useProductActionModal();

    useEffect(() => {
      if (filters.length === 0) fetchFilter();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      form,
    }));

    const addProp: any = (category: string[], key: string, value: any) => ({
      method: "add",
      quoteItems,
      quoteId,
      productCategory: category,
      productName: category.at(-1) ?? "",
      linkId: quoteItemId,
      source: { name: category.at(-1) ?? "", value, key },
    });

    const deleteProp: any = (category: string[]) => ({
      method: "delete",
      linkId: quoteItemId,
      quoteId,
      quoteItems,
      productCategory: category,
      items: [{ name: category.at(-1) ?? "" }],
    });

    const handleFilterHolder = async (v: boolean) => {
      if (v) {
        const r = await showProductActionModal(
          addProp(["过滤器", "过滤器支架"], "filterHolder", false)
        );
        if (!r.result) form.setFieldValue("filterHolder", false);
        return;
      }
      const r = await showProductActionModal(
        deleteProp(["过滤器", "过滤器支架"])
      );
      if (!r.result) form.setFieldValue("filterHolder", true);
    };

    const handleHydraulicStation = async (v: boolean) => {
      if (v) {
        const r = await showProductActionModal(
          addProp(["过滤器", "液压站"], "hydraulicStation", false)
        );
        if (!r.result) form.setFieldValue("hydraulicStation", false);
        return;
      }
      const r = await showProductActionModal(deleteProp(["过滤器", "液压站"]));
      if (!r.result) form.setFieldValue("hydraulicStation", true);
    };

    const handleFieldsChange = async (changed: any) => {
      if (changed.name != null) {
        form.setFieldValue("model", undefined);
      }
      if (changed.model != null) {
        const name = form.getFieldValue("name");

        const item = filters.find(
          (f) => f.name === name && f.model === changed.model
        );

        if (item) {
          form.setFieldsValue({
            filterBoard: item.filterBoard,
            production: item.production,
            dimension: item.dimension,
            weight: item.weight,
            filterDiameter: item.filterDiameter,
            effectiveFilterArea: item.effectiveFilterArea,
            pressure: item.pressure,
          });
        }
      }

      if (changed.filterHolder != null)
        await handleFilterHolder(changed.filterHolder);
      if (changed.hydraulicStation != null)
        await handleHydraulicStation(changed.hydraulicStation);
    };

    return (
      <ProForm
        layout="vertical"
        form={form}
        submitter={false}
        onValuesChange={handleFieldsChange}
        disabled={readOnly}
      >
        <FilterSelection form={form} filters={filters} />
        <ProCard
          title="过滤器参数"
          collapsible
          defaultCollapsed={false}
          style={{ marginBottom: 16 }}
          headerBordered
        >
          <Row gutter={16}>
            <Col xs={12} md={6}>
              <Form.Item
                label="适用塑料原料"
                name="material"
                rules={[{ required: true, message: "请选择原料" }]}
              >
                <MaterialSelect />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <IntervalInputFormItem
                label="工艺温度(℃)"
                name="temperature"
                rules={[{ required: true, message: "请输入温度" }]}
                unit="℃"
              />
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="电压"
                name="voltage"
                rules={[{ required: true, message: "请选择电压" }]}
              >
                <PowerInput />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item label="过滤器功率" name="power">
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) => (value ? `${value}kw` : "")}
                  parser={(value) => value?.replace(/kw/g, "") as any}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={12}>
              <Form.Item label="加热方式" name="heatingMethod">
                <HeatingMethodSelect multiple />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={12} md={6}>
              <Form.Item
                label="是否选配过滤器支架"
                name="filterHolder"
                rules={[{ required: true, message: "是否选配过滤器支架" }]}
                initialValue={false}
              >
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                label="过滤器安全护罩"
                name="safetyShield"
                rules={[{ required: true, message: "是否选配安全护罩" }]}
                initialValue={false}
              >
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Form.Item noStyle dependencies={["safetyShield"]}>
              {({ getFieldValue }) =>
                getFieldValue("safetyShield") && (
                  <Col xs={12} md={6}>
                    <Form.Item
                      name="safetyShieldSpec"
                      label="安全护罩配置"
                      rules={[
                        { required: true, message: "请填写安全护罩配置" },
                      ]}
                      initialValue="精诚标准"
                    >
                      <AutoComplete options={[{ value: "精诚标准" }]} />
                    </Form.Item>
                  </Col>
                )
              }
            </Form.Item>
            <Col xs={12} md={6}>
              <Form.Item
                label="是否配置液压站"
                name="hydraulicStation"
                rules={[{ required: true, message: "是否配置液压站" }]}
                initialValue={false}
              >
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                label="压力传感器孔"
                name="pressureSensorHole"
                rules={[{ required: true, message: "是否打压力传感器孔" }]}
                initialValue={false}
              >
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Form.Item noStyle dependencies={["pressureSensorHole"]}>
              {({ getFieldValue }) =>
                getFieldValue("pressureSensorHole") && (
                  <>
                    <Col xs={12} md={6}>
                      <Form.Item
                        name="preMesh"
                        label="网前"
                        rules={[{ required: true, message: "请选择网前" }]}
                      >
                        <Radio.Group>
                          <Radio value="国产">国产</Radio>
                          <Radio value="进口">进口</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Item
                        name="postMesh"
                        label="网后"
                        rules={[{ required: true, message: "请选择网后" }]}
                      >
                        <Radio.Group>
                          <Radio value="国产">国产</Radio>
                          <Radio value="进口">进口</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </>
                )
              }
            </Form.Item>
          </Row>
        </ProCard>

        <MeshBeltControlCard />
        <Form.Item name="remark" label="备注">
          <TextArea />
        </Form.Item>
      </ProForm>
    );
  }
);

export default FilterForm;
