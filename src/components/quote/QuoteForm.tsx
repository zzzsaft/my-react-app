// components/quote/QuoteForm.tsx
import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Tabs, App, Row, Col, Dropdown, MenuProps } from "antd";
import { Quote, Clause } from "@/types/types";
import QuoteConfigTab from "./QuoteConfigTab";
import QuoteTermsTab from "./QuoteTermsTab";
import ContractTab from "./ContractTab";
import { debounce, throttle } from "lodash-es";
import { useQuoteStore } from "@/store/useQuoteStore";
import { CustomerService } from "@/api/services/customer.service";
import { DownOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/store/useAuthStore";

const getDefaultQuoteTerms = (days: number): Clause[] => [
  {
    id: 1,
    title: "交货期",
    content: `订单确认后模内手动模头（${days}）天交货`,
    index: 1,
  },
  {
    id: 2,
    title: "保障",
    content:
      "按合同技术参数及配置情况为准。符合实际使用要求，正常生产质量三包壹年.",
    index: 2,
  },
  {
    id: 3,
    title: "违约责任",
    content:
      "换免费易损件时，运费需方负责。双方协商解决，协商不成按民法典执行.",
    index: 3,
  },
  {
    id: 4,
    title: "付款方式",
    content: "合同签署后交付合同总金额的30%定金，其它70%在收到货款后发货.",
    index: 4,
  },
  {
    id: 5,
    title: "解决合同纠纷的方式",
    content:
      "本合同在履行过程中发生争议，由当事人双方协商解决，协商不成，当事人双方同意由供方所在地人民法院管辖处理.",
    index: 5,
  },
  {
    id: 6,
    title: "售后服务工作",
    content:
      "负责模头调试工作。旅差费用由供方负责；三包期内使用过程需更换免费易损件时，运费需方负责.",
    index: 6,
  },
];

const DEFAULT_CONTRACT_TERMS: Clause[] = [
  {
    id: 1,
    title: "随机备品，配件工具数量及供应方法<免费提供部分>",
    content: "精诚标准。",
    index: 1,
  },
  {
    id: 2,
    title: "需方选配备品，配件工具数量及供应方法<收费提供部分>",
    content: "无。",
    index: 2,
  },
  {
    id: 3,
    title: "供方对质量负责的条件和期限",
    content:
      "按合同技术参数及配置情况为准。供方提供的产品出料稳定，并在正常使用条件下实行质量三包，为期一年<因工作环境、其它设备原因、操作不当，使用原料及其它意外事故除外>；供方配合产品在国内现场的安装调试及维护；三包期满后供方收取合理成本价费用。",
    index: 3,
  },
  {
    id: 4,
    title: "交(提)货地点、方式",
    content:
      "供方负责发运至需方公司，<在需方公司装卸及其它意外责任由需方负责>。",
    index: 4,
  },
  {
    id: 5,
    title: "运输方式及到达站港和费用负担",
    content: "汽车运输，到达需方公司费用由供方负责。",
    index: 5,
  },
  {
    id: 6,
    title: "包装标准、包装物的供应与验收",
    content: "木箱包装，不计价。",
    index: 6,
  },
  {
    id: 7,
    title: "验收标准，方法及提出异议期限",
    content:
      "双方合同约定技术标准验收。需方收到供方货物后，请及时安排验收，如有异议，60天内书面告知供方，如未提出任何异议将视为默认验收合格。",
    index: 7,
  },
  {
    id: 8,
    title: "结算方式及期限",
    content: "签订合同先付30％预付款，合同生效，余款发货前一次性付清。",
    index: 8,
  },
  {
    id: 9,
    title: "如需提供担保，另立合同担保书，作为本合同附件",
    content: "不需提供。",
    index: 9,
  },
  {
    id: 10,
    title: "违约责任",
    content: "双方协商解决，协商不成按《中华人民国共和国民法典》执行.",
    index: 10,
  },
  {
    id: 11,
    title: "解决合同纠纷的方式",
    content:
      "本合同在履行过程中发生争议，由当事人双方协商解决，协商不成，当事人双方同意由供方所在地人民法院管辖处理.",
    index: 11,
  },
  {
    id: 12,
    title: "其它违约事项",
    content:
      "针对采购精诚的所有产品及配套件，一律不得自行或转交第三方进行测绘或仿制。一经查实，将处以100万元的罚款并追究司法责任。自供方通知需方付款提货日起一个月内需方未履行付款提货，供方将在一个月后（即：由第二个月开始）每日向需方收取本合同总价3‰的仓库管理费。自供方通知需方付款提货日起一年内需方未履行付款提货，供方有权做任何处置，造成的损失由需方自行承担；如供方逾期交货，供方需从最迟交货日的次日起，每日向需方支付延迟交货对应货款3‰的违约金。",
    index: 12,
  },
];

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
  const { updateQuote, saveQuote, isQuoteDirty, fetchPrintUrls } =
    useQuoteStore();
  const [saveLoading, setSaveLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitFlowLoading, setSubmitFlowLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [nameOptions, setNameOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [phoneOptions, setPhoneOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const deliveryDays = Form.useWatch("deliveryDays", form);
  const quoteTerms: Clause[] = Form.useWatch("quoteTerms", form) || [];
  const contractTerms: Clause[] = Form.useWatch("contractTerms", form) || [];
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  const scheduleAutoSave = () => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      if (quote?.id && isQuoteDirty(quote.id)) {
        save();
      }
    }, 60000);
  };
  const handleQuoteTermsChange = (terms: Clause[]) => {
    form.setFieldsValue({ quoteTerms: terms });
  };

  const handleContractTermsChange = (terms: Clause[]) => {
    form.setFieldsValue({ contractTerms: terms });
  };
  const fetchContacts = throttle(async (id: string) => {
    try {
      const data = await CustomerService.getContacts(id);
      const list = data?.contacts || [];
      setContacts(list);
      setNameOptions(list.map((c: any) => ({ value: c.name, label: c.name })));
      setPhoneOptions(
        list.map((c: any) => ({ value: c.phone, label: c.phone }))
      );
      if (data.address) {
        form.setFieldsValue({ address: data.address });
      }
    } catch (e) {
      console.error(e);
    }
  }, 1000);

  const handleNameSelect = (value: string) => {
    const matched = contacts.filter((c) => c.name === value);
    const phones = matched.map((c) => c.phone);
    setPhoneOptions(phones.map((p) => ({ value: p, label: p })));
    if (phones.length === 1) {
      form.setFieldsValue({ contactPhone: phones[0] });
      if (quote) updateQuote(quote.id, { contactPhone: phones[0] });
    }
  };

  const setDefaultQuoteTerms = () => {
    const days = deliveryDays ?? 0;
    form.setFieldsValue({ quoteTerms: getDefaultQuoteTerms(days) });
  };

  const setDefaultContractTerms = () => {
    form.setFieldsValue({ contractTerms: DEFAULT_CONTRACT_TERMS });
  };
  const quote = useQuoteStore((state) =>
    state.quotes.find((q) => q.id == quoteId)
  );
  const loading = useQuoteStore((state) => state.loading.saveQuote);

  useEffect(() => {
    if (quote?.quoteTerms) {
      form.setFieldsValue({ quoteTerms: quote.quoteTerms });
    }
    if (quote?.contractTerms) {
      form.setFieldsValue({ contractTerms: quote.contractTerms });
    }
  }, [quote?.quoteTerms, quote?.contractTerms]);

  useEffect(() => {
    if (quote?.customerId) {
      fetchContacts(quote.customerId);
    }
  }, [quote?.customerId]);

  const onFinish = async () => {
    setSubmitLoading(true);
    if (quote?.id) {
      const userId = useAuthStore.getState().userid?.id;
      const isManager =
        userId === quote.projectManagerId || userId === quote.chargerId;
      if (quote.status === "checking" && isManager) {
        updateQuote(quote.id, { status: "completed" });
      } else if (quote.status === "draft") {
        updateQuote(quote.id, { status: "checking" });
      }
    }
    await save();
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

  const print = async (type: "config" | "quote" | "contract") => {
    if (!quote?.id) return;
    await fetchPrintUrls(quote.id);
    const q = useQuoteStore.getState().quotes.find((i) => i.id === quote.id);
    let url = "";
    if (type === "config") url = q?.configPdf ?? "";
    if (type === "quote") url = q?.quotationPdf ?? "";
    if (type === "contract") url = q?.contractPdf ?? "";
    if (url) window.open(url, "_blank");
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

  const submitFlow = throttle(
    async () => {
      setSubmitFlowLoading(true);
      if (!quote?.id) {
        message.error("提交失败");
        return;
      }
      await saveQuote(quote.id, true);
      setSubmitFlowLoading(false);
      message.success("已提交流程");
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
      if (customer?.erpId) {
        fetchContacts(customer.erpId);
      }
    } else {
      updateQuote(quote.id, {
        ...changedValues,
      });
    }
    scheduleAutoSave();
  }, 100);

  const userId = useAuthStore.getState().userid?.id;
  const isManager =
    userId === quote?.projectManagerId || userId === quote?.chargerId;
  const submitLabel =
    quote?.status === "checking" && isManager ? "已检查" : "提交";
  const showSubmitFlow = quote?.currentApprover === userId;

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
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "配置表",
            key: "1",
            children: (
              <QuoteConfigTab
                form={form}
                quote={quote}
                nameOptions={nameOptions}
                phoneOptions={phoneOptions}
                handleNameSelect={handleNameSelect}
              />
            ),
            forceRender: true,
          },
          {
            label: "报价条约",
            key: "2",
            children: (
              <Form.Item name="quoteTerms" noStyle>
                <QuoteTermsTab
                  value={quoteTerms}
                  onChange={handleQuoteTermsChange}
                  onSetDefault={setDefaultQuoteTerms}
                />
              </Form.Item>
            ),
          },
          {
            label: "合同",
            key: "3",
            children: (
              <Form.Item name="contractTerms" noStyle>
                <ContractTab
                  value={contractTerms}
                  onChange={handleContractTermsChange}
                  onSetDefault={setDefaultContractTerms}
                />
              </Form.Item>
            ),
          },
        ]}
      />

      <Row justify="space-between">
        <Col>
          <Dropdown
            // trigger={["click"]}
            // onClick={({ key }) => print(key as any)}
            menu={{
              items: [
                { key: "config", label: "配置表" },
                { key: "quote", label: "报价" },
                { key: "contract", label: "合同" },
              ],
              onClick: ({ key }) => print(key as any),
              // onClick: ({ key }) => console.log(key),
            }}
          >
            <Button>
              打印 <DownOutlined />
            </Button>
          </Dropdown>
        </Col>
        <Col style={{ textAlign: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading && submitLoading}
          >
            {submitLabel}
          </Button>
          {showSubmitFlow && (
            <Button
              style={{ marginLeft: 8 }}
              onClick={submitFlow}
              loading={loading && submitFlowLoading}
            >
              提交流程
            </Button>
          )}
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
