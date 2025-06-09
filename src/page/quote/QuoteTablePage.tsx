import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Button,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { useQuoteStore } from "../../store/useQuoteStore";
import { DebounceSelect } from "../../components/general/DebounceSelect";
import { CustomerService } from "../../api/services/customer.service";
import { SearchOutlined } from "@ant-design/icons";
import CompanySearchSelect from "../../components/general/CompanySearchSelect";
import MemberAvatar from "../../components/general/MemberAvatar";
import MemberSelect from "../../components/general/MemberSelect";
import { AddHistoryModal } from "../../components/quote/AddHistoryModal";
import QuoteModal from "../../components/quote/QuoteModal";
import { Quote } from "../../types/types";
import { throttle } from "lodash-es";

interface QuoteTableItem {
  key: number;
  quoteId: string;
  customerName: string;
  quoteTime: Date;
  type: string;
  status: string;
  flowState: string;
  chargerId: string;
  salesSupportId: string;
  quoteName: string;
}

const QuoteTablePage: React.FC = () => {
  const { quotes, loading, fetchQuotes, fetchQuote } = useQuoteStore(); // Assuming your store has loading state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | undefined>(
    undefined
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const lastClickTime = useRef(0);

  const handleRowClick = useCallback(
    async (record: QuoteTableItem) => {
      const now = Date.now();
      if (now - lastClickTime.current < 1000) return; // 1秒内禁止重复点击
      lastClickTime.current = now;

      const quoteData = await fetchQuote(record.key);
      setSelectedQuote(quoteData);
      setModalVisible(true);
    },
    [fetchQuote]
  );

  // Transform quotes data for table
  const tableData: QuoteTableItem[] = quotes.map((quote) => ({
    key: quote.id,
    quoteId: (quote.quoteId || quote.orderId) ?? "",
    customerName: quote.customerName,
    quoteTime: quote.quoteTime as any,
    type: quote.type || "OA", // Default to OA if empty
    status: quote.status,
    flowState: quote.flowState,
    chargerId: quote.chargerId,
    salesSupportId: quote.salesSupportId,
    quoteName: quote.quoteName,
    projectManagerId: quote.projectManagerId,
  }));

  const columns: ColumnsType<QuoteTableItem> = [
    {
      title: "ID",
      dataIndex: "quoteId",
      key: "quoteId",
      width: 80,
      sorter: (a, b) => a.quoteId.localeCompare(b.quoteId),
    },
    {
      title: "报价名称",
      dataIndex: "quoteName",
      key: "quoteName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "客户名称",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
      filters: [...new Set(quotes.map((q) => q.customerName))].map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) =>
        record.customerName.includes(value as string),
    },
    {
      title: "报价日期",
      dataIndex: "quoteTime",
      key: "quoteTime",
      width: 120,
      sorter: (a, b) =>
        new Date(a.quoteTime).getTime() - new Date(b.quoteTime).getTime(),
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "报价类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      filters: [
        { text: "OA", value: "OA" },
        { text: "历史", value: "history" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type: string) => (
        <Tag color={type === "history" ? "blue" : "green"}>
          {type === "history" ? "历史" : "OA"}
        </Tag>
      ),
    },
    {
      title: "当前状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: [
        { text: "草稿", value: "draft" },
        { text: "已完成", value: "completed" },
        { text: "已锁定", value: "locked" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        let color = "";
        switch (status) {
          case "draft":
            color = "orange";
            break;
          case "completed":
            color = "green";
            break;
          case "locked":
            color = "red";
            break;
          default:
            color = "gray";
        }
        return (
          <Tag color={color}>
            {status === "draft"
              ? "草稿"
              : status === "completed"
              ? "已完成"
              : "已锁定"}
          </Tag>
        );
      },
    },
    {
      title: "审批状态",
      dataIndex: "flowState",
      key: "flowState",
      width: 120,
      render: (flowState: string, record: QuoteTableItem) =>
        record.type === "history" ? (
          "-"
        ) : (
          <Tag color={flowState ? "cyan" : "default"}>
            {flowState || "未审批"}
          </Tag>
        ),
    },
    {
      title: "销售负责人",
      dataIndex: "chargerId",
      key: "chargerId",
      width: 120,
      render: (chargerId: string) =>
        (chargerId && <MemberAvatar id={chargerId} />) || "-",
    },
    {
      title: "项目负责人",
      dataIndex: "projectManagerId",
      key: "projectManagerId",
      width: 120,
      render: (projectManagerId: string) =>
        (projectManagerId && <MemberAvatar id={projectManagerId} />) || "-",
    },
    {
      title: "销售支持",
      dataIndex: "salesSupportId",
      key: "salesSupportId",
      width: 120,
      render: (salesSupportId: string) =>
        (salesSupportId && <MemberAvatar id={salesSupportId} />) || "-",
    },
  ];

  return (
    <>
      <AddHistoryModal />
      <Table<QuoteTableItem>
        columns={columns}
        dataSource={tableData}
        bordered
        size="middle"
        scroll={{ x: "max-content", y: "calc(100vh - 250px)" }}
        pagination={{
          pageSizeOptions: ["10", "20", "50", "100"],
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        loading={loading.getQuotes}
        sticky
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          // async () => {
          //   const quoteData = await fetchQuote(record.key);
          //   setSelectedQuote(quoteData);
          //   setModalVisible(true);
          //   // navigate(`/quote/${record.key}`);
          // },
        })}
      />
      <QuoteModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        // onOk={handleModalOk}
        initialValues={selectedQuote}
        loading={loading.getQuote}
        onSubmit={() => setModalVisible(false)}
      />
    </>
  );
};

export default QuoteTablePage;
