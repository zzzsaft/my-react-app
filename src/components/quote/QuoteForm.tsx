// components/quote/QuoteForm.tsx
import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Row,
  Col,
  Button,
  App,
} from "antd";
import type { DatePickerProps } from "antd";
import CompanySearchSelect from "../general/CompanySearchSelect";
import MemberSelect from "../general/MemberSelect";
import { Quote } from "../../types/types";
import dayjs from "dayjs";
import { ProCard } from "@ant-design/pro-components";
import { MoneyInput } from "../general/MoneyInput";
import AddressInput from "../general/AddressInput";
import { CustomSelect } from "../general/CustomSelect";
import QuoteItemsTable from "./QuoteItemsTable";
import { debounce, throttle } from "lodash-es";
import { useQuoteStore } from "../../store/useQuoteStore";
import MaterialSelect from "../general/MaterialSelect";

const { Option } = Select;
const { TextArea } = Input;

const INDUSTRY = {
  新能源及储能: ["动力电池（锂电、氢燃料、钠电）", "光伏新能源"],
  半导体及电子元器件: ["半导体（泛半导体）", "先进封装", "高端显示"],
  消费电子: ["消费电子"],
  医疗及环保: ["医疗卫生", "环保行业"],
  工业制造及材料: ["新型建材", "包装行业"],
};

interface QuoteFormProps {
  form: any;
  quoteId?: number | undefined;
  onSubmit: () => void;
  isModal?: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  form,
  quoteId,
  onSubmit,
  isModal = false,
}) => {
  const { message } = App.useApp();
  const { updateQuote, saveQuote } = useQuoteStore();
  const [saveLoading, setSaveLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const quote = useQuoteStore((state) =>
    state.quotes.find((q) => q.id == quoteId)
  );
  const loading = useQuoteStore((state) => state.loading.saveQuote);
  const onDateChange: any = (date: any, dateString: string) => {
    form.setFieldsValue({ quoteTime: date?.toDate() });
  };
  const onFinish = async () => {
    setSubmitLoading(true);
    if (quote?.id) updateQuote(quote.id, { status: "completed" });
    await save();
    console.log(quote);
    onSubmit();
    setSubmitLoading(false);
  };

  const onFinishFailed = ({ errorFields }: { errorFields: any }) => {
    if (errorFields.length > 0) {
      const firstError = errorFields[0];
      const errorMsg = firstError.errors[0];
      message.error(`${errorMsg}`);
    }
  };

  const save = throttle(
    async () => {
      setSaveLoading(true);
      if (!quote?.id) {
        message.error("保存失败");
        return;
      }
      await saveQuote(quote?.id);
      setSaveLoading(false);
      message.success("保存成功");
    },
    5000,
    { leading: true, trailing: false }
  );

  const updateStore = debounce((changedValues: any) => {
    if (!quote?.id) return;

    if (changedValues.customerName) {
      const customer = changedValues.customerName as any;
      updateQuote(quote.id, {
        customerId: customer?.erpId,
        customerName: customer?.name,
      });
    } else {
      updateQuote(quote.id, {
        ...changedValues,
      });
    }
  }, 100);

  return (
    <Form
      form={form}
      scrollToFirstError={{ behavior: "smooth", block: "nearest", focus: true }}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={updateStore}
      preserve={true}
    >
      <Row gutter={16}></Row>
      <ProCard
        title="基础信息"
        collapsible
        defaultCollapsed={false}
        style={{ marginBottom: 16 }}
        headerBordered
      >
        <Row gutter={16}>
          {quote?.type != "history" && (
            <Col xs={8} md={4}>
              <Form.Item
                name="quoteNumber"
                label="报价单编号"
                rules={[{ required: true, message: "请输入报价单编号" }]}
              >
                <Input
                  style={{ width: "100%" }}
                  readOnly={quote?.type != "history"}
                />
              </Form.Item>
            </Col>
          )}
          <Col xs={8} md={4}>
            <Form.Item
              name="orderId"
              label="订单编号"
              rules={[{ required: true, message: "订单编号" }]}
            >
              <Input
                style={{ width: "100%" }}
                readOnly={quote?.type != "history"}
              />
            </Form.Item>
          </Col>
          {quote?.type != "history" && (
            <Col xs={8} md={8}>
              <Form.Item name="opportunityName" label="商机名称">
                <Input readOnly />
              </Form.Item>
            </Col>
          )}

          <Col xs={12} md={8}>
            <Form.Item
              name="quoteName"
              label="报价单名称"
              rules={[{ required: true, message: "请输入报价单名称" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={12} md={8}>
            <Form.Item
              name="material"
              label="适用原料"
              rules={[{ required: true, message: "请填写适用原料" }]}
            >
              <MaterialSelect />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item name="finalProduct" label="最终产品">
              <Select mode="tags" placeholder="请选择最终产品">
                <Option value="furniture">家具</Option>
                <Option value="electronics">电子产品</Option>
                <Option value="packaging">包装</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item name="applicationField" label="应用领域">
              <CustomSelect
                mode="multiple"
                initialGroups={INDUSTRY}
                dropdown={false}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="产品明细"
              rules={[
                {
                  required: true,
                  validator: () => {
                    if (!quote?.items) {
                      return Promise.reject("请输入至少一条产品");
                    }
                    if (quote?.items.length == 0) {
                      return Promise.reject("请输入至少一条产品");
                    }
                    return Promise.resolve();
                  },
                },
                {
                  required: true,
                  validator: () => {
                    const index = quote?.items.findIndex(
                      (item) => !item.isCompleted
                    );
                    if (index != -1) {
                      return Promise.reject(
                        `第${index ?? 0 + 1}个产品产品配置未完成`
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <QuoteItemsTable quoteId={quote?.id ?? 0} />
            </Form.Item>
          </Col>
        </Row>
      </ProCard>
      <ProCard
        title="报价单价格"
        collapsible
        defaultCollapsed={false}
        style={{ marginBottom: 16 }}
        headerBordered
      >
        <Row gutter={16}>
          <Col xs={12} md={6}>
            <Form.Item label="产品价格合计">
              <MoneyInput
                quoteId={quote?.id ?? 0}
                value={quote?.totalProductPrice ?? 0}
                readOnly
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item
              name="discountAmount"
              label="优惠金额"
              normalize={(value) => parseFloat(value)}
            >
              <MoneyInput quoteId={quote?.id ?? 0} />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="报价单金额">
              <MoneyInput
                quoteId={quote?.id ?? 0}
                value={quote?.quoteAmount ?? 0}
                readOnly
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item
              name="deliveryDays"
              label="交期天数"
              rules={[{ required: true, message: "请输入交期天数" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                max={365}
                formatter={(value) => `${value}天`}
                controls={false}
                parser={(value) => {
                  const num = Number(value?.replace("天", "") || 0);
                  return Math.min(Math.max(num, 0), 365) as any;
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </ProCard>
      <ProCard
        title="联系信息"
        collapsible
        defaultCollapsed={false}
        style={{ marginBottom: 16 }}
        headerBordered
      >
        <Row gutter={16}>
          <Col xs={12} md={8}>
            <Form.Item
              name="customerName"
              label="客户选择"
              rules={[{ required: true, message: "请选择客户" }]}
            >
              <CompanySearchSelect placeholder="请选择客户" />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item
              name="contactName"
              label="联系人姓名"
              rules={[{ required: true, message: "请输入联系人姓名" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col xs={12} md={8}>
            <Form.Item
              name="contactPhone"
              label="联系人手机号"
              rules={[{ required: true, message: "请输入联系人手机号" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item name="address" label="地址">
              <AddressInput />
            </Form.Item>
          </Col>
        </Row>
      </ProCard>
      <ProCard
        title="负责人信息"
        collapsible
        defaultCollapsed={false}
        style={{ marginBottom: 16 }}
        headerBordered
      >
        <Row gutter={16}>
          <Col xs={12} md={6}>
            <Form.Item
              name="creatorId"
              label="创建人"
              rules={[{ required: true, message: "请选择创建人" }]}
            >
              <MemberSelect placeholder="选择创建人" disabled />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item
              name="chargerId"
              label="负责人"
              rules={[{ required: true, message: "请选择负责人" }]}
            >
              <MemberSelect placeholder="选择负责人" />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item name="projectManagerId" label="项目管理">
              <MemberSelect placeholder="选择项目管理" />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item name="salesSupportId" label="销售支持">
              <MemberSelect placeholder="选择销售支持" />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item
              name="quoteTime"
              label="报价时间"
              rules={[{ required: true, message: "请选择报价时间" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                onChange={onDateChange}
                maxDate={dayjs("2025/5/1")}
              />
            </Form.Item>
          </Col>
        </Row>
      </ProCard>

      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading && submitLoading}
          >
            提交
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={save}
            loading={loading && saveLoading}
          >
            暂存
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default QuoteForm;
