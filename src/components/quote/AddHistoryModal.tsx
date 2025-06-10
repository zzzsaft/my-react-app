import { Modal, Input, DatePicker, Form, Button, Row, Col, App } from "antd";
import { CustomerService } from "../../api/services/customer.service";
import CompanySearchSelect from "../general/CompanySearchSelect";
import { useQuoteStore } from "../../store/useQuoteStore";
import { useState } from "react";
import MemberSelect from "../general/MemberSelect";
import dayjs from "dayjs";

export const AddHistoryModal = () => {
  // 处理提交历史报价单
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { createQuote } = useQuoteStore();
  const [modalVisible, setModalVisible] = useState(false);
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setModalVisible(false);
      await createQuote({
        ...values,
        orderId: values.orderId,
        customerId: values.customer.erpId,
        customerName: values.customer.name,
        date: new Date(values.quoteTime),
        chargerId: values.chargerId,
        projectManagerId: values.projectManagerId,
        quoteName: values.quoteName,
      });
      message.success("历史报价单添加成功");
      form.resetFields();
    } catch (error) {
      console.error("添加历史报价单失败:", error);
      message.error("添加历史报价单失败");
    }
  };
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          添加历史报价单
        </Button>
      </div>
      <Modal
        title="添加历史报价单"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            {/* <Col xs={12} md={12}>
              <Form.Item
                name="quoteId"
                label="报价编号"
                rules={[{ required: true, message: "请输入报价编号" }]}
              >
                <Input placeholder="请输入报价编号" />
              </Form.Item>
            </Col> */}
            <Col xs={12} md={12}>
              <Form.Item
                name="orderId"
                label="订单编号"
                rules={[{ required: true, message: "请输入订单编号" }]}
              >
                <Input placeholder="请输入订单编号" />
              </Form.Item>
            </Col>
            <Col xs={12} md={12}>
              <Form.Item
                name="quoteName"
                label="报价名称"
                rules={[{ required: true, message: "请输入报价名称" }]}
              >
                <Input placeholder="请输入报价名称" />
              </Form.Item>
            </Col>
            <Col xs={12} md={12}>
              <Form.Item
                name="customer"
                label="客户名称"
                rules={[{ required: true, message: "请选择客户" }]}
              >
                <CompanySearchSelect
                  fetchOptions={CustomerService.searchCompanies}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={12}>
              <Form.Item
                name="quoteTime"
                label="报价日期"
                rules={[{ required: true, message: "请选择报价日期" }]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  maxDate={dayjs("2025/5/1")}
                />
              </Form.Item>
            </Col>
            <Col xs={12} md={12}>
              <Form.Item
                name="chargerId"
                label="销售负责人"
                rules={[{ required: true, message: "请选择销售负责人" }]}
              >
                <MemberSelect />
              </Form.Item>
            </Col>
            <Col xs={12} md={12}>
              <Form.Item
                name="projectManagerId"
                label="项目负责人"
                rules={[{ required: true, message: "请选择项目负责人" }]}
              >
                <MemberSelect />
              </Form.Item>
            </Col>
            <Col xs={12} md={12}></Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
