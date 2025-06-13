import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Table, Tag, Form, Input } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import MemberAvatar from "../general/MemberAvatar";
import QuoteModal from "./QuoteModal";
import { useQuoteStore } from "../../store/useQuoteStore";

interface QuoteTableProps {
  type: string; // 'history' | 'oa'
}

interface QuoteTableItem {
  key: number;
  quoteId: string;
  orderId: string;
  customerName: string;
  quoteTime: Date;
  status: string;
  flowState: string;
  chargerId: string;
  salesSupportId: string;
  quoteName: string;
  projectManagerId: string;
  creatorId: string;
  createdAt: string;
}

const QuoteTable: React.FC<QuoteTableProps> = ({ type }) => {
  const { quotes, total, loading, fetchQuotes, fetchQuote } = useQuoteStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>();
  const [searchForm] = Form.useForm();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const lastClickTime = useRef(0);

  useEffect(() => {
    setPagination((p) => ({ ...p, total }));
  }, [total]);

  useEffect(() => {
    fetchQuotes({
      page: pagination.current,
      pageSize: pagination.pageSize,
      type,
    });
  }, [fetchQuotes, pagination.current, pagination.pageSize, type]);

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    setPagination((p) => ({ ...p, current: 1 }));
    fetchQuotes({
      page: 1,
      pageSize: pagination.pageSize,
      type,
      quoteName: values.quoteName,
      customerName: values.customerName,
    });
  };

  const handleTableChange = (p: TablePaginationConfig) => {
    setPagination(p);
    const values = searchForm.getFieldsValue();
    fetchQuotes({
      page: p.current,
      pageSize: p.pageSize,
      type,
      quoteName: values.quoteName,
      customerName: values.customerName,
    });
  };

  const handleRowClick = useCallback(
    async (record: QuoteTableItem) => {
      const now = Date.now();
      if (now - lastClickTime.current < 1000) return;
      lastClickTime.current = now;

      setSelectedQuote(undefined);
      setModalVisible(true);
      const quoteData = await fetchQuote(record.key);
      setSelectedQuote(quoteData);
    },
    [fetchQuote]
  );

  const columns: ColumnsType<QuoteTableItem> = [
    {
      title: "报价编号",
      dataIndex: "quoteId",
      key: "quoteId",
      width: 80,
      sorter: (a, b) => a.quoteId.localeCompare(b.quoteId),
    },
    {
      title: "订单编号",
      dataIndex: "orderId",
      key: "orderId",
      width: 80,
      sorter: (a, b) => (a.orderId || "").localeCompare(b.orderId || ""),
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
      title: "创建日期",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "当前状态",
      dataIndex: "status",
      key: "status",
      width: 100,
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
    ...(type === "history"
      ? []
      : [
          {
            title: "审批状态",
            dataIndex: "flowState",
            key: "flowState",
            width: 120,
            render: (flowState: string) => (
              <Tag color={flowState ? "cyan" : "default"}>
                {flowState || "未审批"}
              </Tag>
            ),
          },
        ]),
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
    {
      title: "创建人",
      dataIndex: "creatorId",
      key: "creatorId",
      width: 120,
      render: (creatorId: string) =>
        (creatorId && <MemberAvatar id={creatorId} />) || "-",
    },
  ];

  const tableData = useMemo(
    () =>
      quotes.map((quote) => ({
        key: quote.id,
        quoteId: quote.quoteId ?? "",
        orderId: quote.orderId ?? "",
        customerName: quote.customerName,
        quoteTime: quote.quoteTime as any,
        createdAt: (quote as any).createdAt ?? "",
        status: quote.status,
        flowState: quote.flowState,
        chargerId: quote.chargerId,
        salesSupportId: quote.salesSupportId,
        quoteName: quote.quoteName,
        projectManagerId: quote.projectManagerId,
        creatorId: quote.creatorId,
      })),
    [quotes]
  );

  return (
    <>
      <Form
        form={searchForm}
        layout="inline"
        style={{ marginBottom: 16 }}
        onFinish={handleSearch}
      >
        <Form.Item name="quoteName" label="报价名称">
          <Input placeholder="请输入报价名称" allowClear />
        </Form.Item>
        <Form.Item name="customerName" label="客户名称">
          <Input placeholder="请输入客户名称" allowClear />
        </Form.Item>
        <Form.Item>
          <Input type="submit" value="查询" style={{ width: 80 }} />
        </Form.Item>
      </Form>
      <Table<QuoteTableItem>
        columns={columns}
        dataSource={tableData}
        bordered
        size="middle"
        scroll={{ x: "max-content", y: "calc(100vh - 250px)" }}
        pagination={{
          ...pagination,
          pageSizeOptions: ["10", "20", "50", "100"],
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        loading={loading.getQuotes}
        onChange={handleTableChange}
        sticky
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <QuoteModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        initialValues={selectedQuote}
        loading={loading.getQuote}
        onSubmit={() => setModalVisible(false)}
      />
    </>
  );
};

export default QuoteTable;
