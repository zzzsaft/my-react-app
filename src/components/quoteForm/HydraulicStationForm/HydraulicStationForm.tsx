import { Col, Form, FormInstance, InputNumber, Row, Segmented, Typography } from "antd";
import { forwardRef, useImperativeHandle } from "react";
import ProForm from "@ant-design/pro-form";
import { PowerInput } from "../formComponents/PowerInput";
import { useQuoteStore } from "../../../store/useQuoteStore";

interface HydraulicStationFormProps {
  quoteId: number;
  quoteItemId: number;
}

const HydraulicStationForm = forwardRef(({ quoteId, quoteItemId }: HydraulicStationFormProps, ref) => {
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    form,
  }));

  const quoteItems = useQuoteStore.getState().quotes.find(q => q.id === quoteId)?.items ?? [];
  const findItemById = useQuoteStore.getState().findItemById;
  const currentItem = findItemById(quoteItems, quoteItemId);
  const linkedName = currentItem?.linkId ? findItemById(quoteItems, currentItem.linkId)?.productName : undefined;

  return (
    <ProForm layout="vertical" form={form} submitter={false}>
      {linkedName && (
        <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          关联产品：{linkedName}
        </Typography.Text>
      )}
      <Row gutter={16}>
        <Col xs={12} md={6}>
          <Form.Item label="类型" name="type" initialValue="油泵" rules={[{ required: true, message: '请选择类型' }]}> 
            <Segmented options={["油泵", "蓄能器"]} />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item label="规格" name="spec" initialValue="电磁阀" rules={[{ required: true, message: '请选择规格' }]}> 
            <Segmented options={["电磁阀", "手动阀"]} />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item label="阀共享数量" name="valveShare" initialValue="一" rules={[{ required: true, message: '请选择共享阀数量' }]}> 
            <Segmented options={["一", "二", "三", "四"]} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="电机电压" name="powerInput" rules={[{ required: true, message: '请输入电机电压' }]}> 
            <PowerInput />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item label="功率" name="power" rules={[{ required: true, message: '请输入功率' }]}> 
            <InputNumber style={{ width: '100%' }} formatter={v => (v ? `${v}kw` : '')} parser={v => v?.replace(/kw/g, '') as any} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={12} md={6}>
          <Form.Item label="油管长度" name="pipeLength" rules={[{ required: true, message: '请输入油管长度' }]}> 
            <InputNumber style={{ width: '100%' }} addonAfter="米" min={0} />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item label="油管数量" name="pipeQuantity" rules={[{ required: true, message: '请输入油管数量' }]}> 
            <InputNumber style={{ width: '100%' }} addonAfter="条" min={0} />
          </Form.Item>
        </Col>
      </Row>
    </ProForm>
  );
});

export default HydraulicStationForm;
