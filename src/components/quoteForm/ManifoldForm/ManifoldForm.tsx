import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";
import { ProCard } from "@ant-design/pro-components";
import ProForm from "@ant-design/pro-form";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useQuoteStore } from "@/store/useQuoteStore";
import ImportProductModal from "@/components/quote/ProductConfigForm/ImportProductModal";
import MaterialSelect from "@/components/general/MaterialSelect";
import AutoSlashInput from "@/components/general/AutoSlashInput";
import ProFormListWrapper from "../formComponents/ProFormListWrapper";
import { HeatingMethodSelect } from "../formComponents/HeatingMethodInput";
import PowerFormItem from "../formComponents/PowerFormItem";
import { CustomSelect } from "@/components/general/CustomSelect";
import { MATERIAL_OPTIONS } from "@/util/MATERIAL";

export interface ManifoldFormProps {
  quoteId?: number;
  quoteItemId?: number;
  readOnly?: boolean;
}

const options = [
  { label: "需方客户提供图纸", value: "需方客户提供图纸" },
  { label: "供方精诚设计图纸", value: "供方精诚设计图纸" },
  { label: "按原图纸", value: "按原图纸" },
];

const ManifoldForm = forwardRef(
  (
    {
      quoteId,
      quoteItemId,
      readOnly = false,
    }: { quoteId: number; quoteItemId: number; readOnly?: boolean },
    ref
  ) => {
    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const a = useQuoteStore.getState().quotes;
    const quoteItems =
      useQuoteStore.getState().quotes.find((q) => q.id === quoteId)?.items ??
      [];
    const findItemById = useQuoteStore.getState().findItemById;
    const currentItem = findItemById(quoteItems, quoteItemId);
    const linkedName = currentItem?.linkId
      ? findItemById(quoteItems, currentItem.linkId)?.productName
      : undefined;
    const isLinked = !!currentItem?.linkId;

    useImperativeHandle(ref, () => ({
      form,
    }));

    const handleImport = (item: any) => {
      if (item?.config) {
        const {
          material,
          temperature,
          runnerNumber,
          compositeStructure,
          runnerLayers,
        } = item.config as any;
        form.setFieldsValue({
          material: material,
          temperature: temperature,
          runnerNumber: runnerNumber,
          compositeStructure: compositeStructure,
          runnerLayers: runnerLayers,
        });
      }
      setModalOpen(false);
    };

    return (
      <ProCard
        title="合流器配置"
        // collapsible
        defaultCollapsed={false}
        style={{ marginBottom: 16 }}
        headerBordered
      >
        <ProForm
          layout="vertical"
          form={form}
          submitter={false}
          preserve={false}
        >
          {linkedName && (
            <Typography.Text
              type="secondary"
              style={{ display: "block", marginBottom: 16 }}
            >
              关联产品：{linkedName}
            </Typography.Text>
          )}
          {isLinked ? (
            <Row gutter={16}>
              <Col xs={12} md={6}>
                <Form.Item
                  label="合流器加热分区"
                  name="heatingZone"
                  rules={[{ required: true, message: "请输入合流器加热分区" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={12} md={6}>
                <Form.Item
                  label="合流器图纸"
                  name="blueprint"
                  rules={[{ required: true, message: "请选择合流器图纸" }]}
                >
                  <Select options={options} allowClear />
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="是否与模头互配"
                    colon={false}
                    style={{ marginBottom: 0 }}
                  >
                    <Button onClick={() => setModalOpen(true)}>
                      选择模头编号
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={12} md={6}>
                  <Form.Item
                    label="合流器加热分区"
                    name="heatingZone"
                    rules={[
                      { required: true, message: "请输入合流器加热分区" },
                    ]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item
                    name="heatingMethod"
                    label="加热方式"
                    rules={[{ required: true, message: "请选择加热方式" }]}
                  >
                    <HeatingMethodSelect multiple />
                  </Form.Item>
                </Col>
                <PowerFormItem
                  dependencyName="heatingMethod"
                  name="power"
                  label="加热电压"
                />
                <Col xs={12} md={6}>
                  <Form.Item
                    name="material"
                    label="塑料原料"
                    rules={[{ required: true, message: "请选择原料" }]}
                  >
                    <MaterialSelect />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item
                    name="temperature"
                    label="工艺温度"
                    rules={[{ required: true, message: "请输入温度" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item
                    name="runnerNumber"
                    label="共挤复合层数"
                    rules={[{ required: true, message: "请输入层数" }]}
                  >
                    <InputNumber min={1} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item
                    name="compositeStructure"
                    label="层结构形式"
                    rules={[{ required: true, message: "请输入结构形式" }]}
                  >
                    <AutoSlashInput />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <ProFormListWrapper
                    name="runnerLayers"
                    label="每层复合比例"
                    min={1}
                    creatorButtonProps={{ creatorButtonText: "新增" }}
                    formItems={
                      <ProForm.Item
                        name={[]}
                        rules={[{ required: true, message: "请输入比例" }]}
                      >
                        <Input />
                      </ProForm.Item>
                    }
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item
                    name="manifoldMaterial"
                    label="合流器材料"
                    initialValue="3Cr13"
                    rules={[{ required: true, message: "请选择材料" }]}
                  >
                    <CustomSelect initialGroups={MATERIAL_OPTIONS} />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item name="extruder" label="挤出机分布">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Item
                    label="合流器图纸"
                    name="blueprint"
                    rules={[{ required: true, message: "请选择合流器图纸" }]}
                  >
                    <Select options={options} allowClear />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </ProForm>
        <ImportProductModal
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onImport={handleImport}
          formType="DieForm"
          orderOnly
        />
      </ProCard>
    );
  }
);

export default ManifoldForm;
