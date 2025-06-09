import { Table, Button, Typography, App } from "antd";
import { PlusOutlined, DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import * as _ from "lodash";
import { useQuoteStore } from "../../store/useQuoteStore";
import ProductCascader from "./ProductCascader";
import { formatPrice } from "../../util/valueUtil";
import ProductConfigModal from "./ProductConfigForm/ProductConfigModal";
import { QuoteItem } from "../../types/types";
import { useMemo, useState } from "react";
import SortableTable, { DragHandle } from "../general/SortableTable";
import { SortableColumn } from "../general/SortableColumn";
interface QuoteItemsTableProps {
  quoteId: number;
  items: QuoteItem[];
  confirmDelete: (item: QuoteItem) => void;
}

const DesktopQuoteItemsTable: React.FC<QuoteItemsTableProps> = ({
  quoteId,
  confirmDelete,
  items,
}) => {
  const isLocked = useQuoteStore(
    (state) =>
      state.quotes.find((quote) => quote.id === quoteId)?.status == "locked" ||
      false
  );
  const { addQuoteItem, updateQuoteItem, setQuoteItem } = useQuoteStore();
  const { message } = App.useApp();
  const loading = useQuoteStore((state) => state.loading);
  const [currentItem, setCurrentItem] = useState<QuoteItem>();

  const handleCascaderChange = (value: string[], record: QuoteItem) => {
    if (!value || value.length === 0) return;
    updateQuoteItem(quoteId, record.id, {
      productCategory: value,
      isCompleted: false,
      productName: value[value.length - 1] ?? "",
    });
  };
  const [open, setOpen] = useState(false);

  const handleDragEnd = (newData: QuoteItem[]) => {
    setQuoteItem(quoteId, newData);
  };

  const handleRowClick = (record: QuoteItem) => {
    if (!record.productCategory || record.productCategory.length === 0) {
      message.warning("请先填写产品类型");
    } else {
      setCurrentItem(record);
      setOpen(true);
    }
  };

  const expandedRowKeys = useMemo(
    () => getDefaultExpandedRowKeys(items),
    [items]
  );

  const columns = [
    {
      ...SortableColumn,
      render: (text: string, record: QuoteItem) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <DragHandle disabled={isLocked} />
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "isCompleted",
      width: 10,
      render: (completed: boolean, record: any) => (
        <span style={{ display: "flex", justifyContent: "center" }}>
          {record.linkId ? (
            <LinkOutlined
              style={{
                fontSize: 10,
                color: completed ? "green" : "red", // 根据 completed 设置颜色
              }}
            />
          ) : completed ? (
            <span style={{ color: "green", fontSize: 10 }}>●</span>
          ) : (
            <span style={{ color: "red", fontSize: 10 }}>●</span>
          )}
        </span>
      ),
    },
    {
      title: "产品类型",
      dataIndex: "productCategory",
      width: 150,
      minWidth: 80,
      render: (value: string[], record: QuoteItem) => {
        if (!record) return null;
        const currentValue = record.productCategory ?? undefined;
        const isLinked = record.linkId ? true : false;
        return !(isLocked || isLinked || record.isCategoryLocked) ? (
          <div onClick={(e) => e.stopPropagation()}>
            <ProductCascader
              value={currentValue}
              onChange={(val) => handleCascaderChange(val, record)}
              disabled={isLocked || isLinked}
            />
          </div>
        ) : (
          <div>{value.at(-1)}</div>
        );
      },
    },
    {
      title: "产品名称",
      dataIndex: "productName",
      render: (value: string) => (
        <Typography.Text style={{ minWidth: "150px", display: "inline-block" }}>
          {value}
        </Typography.Text>
      ),
    },
    {
      title: "品牌",
      dataIndex: "brand",
      width: 80,
      render: (value: string) => (
        <Typography.Text
          style={{
            width: "60px",
            whiteSpace: "nowrap",
            display: "inline-block",
          }}
        >
          {value}
        </Typography.Text>
      ),
    },
    {
      title: "单价",
      dataIndex: "unitPrice",
      width: 120,
      render: (value: number) => (
        <Typography.Text
          style={{ whiteSpace: "nowrap", display: "inline-block" }}
        >
          ¥ {formatPrice(value)}
        </Typography.Text>
      ),
    },
    {
      title: "数量",
      dataIndex: "quantity",
      width: 80,
      render: (value: number, record: QuoteItem) => (
        <Typography.Text
          style={{ whiteSpace: "nowrap", display: "inline-block" }}
        >
          {formatValueWithUnit(value, record.unit)}
        </Typography.Text>
      ),
    },
    {
      title: "折扣率(%)",
      dataIndex: "discountRate",
      width: 100,
      render: (value: number) => (
        <Typography.Text
          style={{ whiteSpace: "nowrap", display: "inline-block" }}
        >
          {value}%
        </Typography.Text>
      ),
    },
    {
      title: "小计",
      dataIndex: "subtotal",
      width: 120,
      render: (value: number) => (
        <Typography.Text
          strong
          style={{ whiteSpace: "nowrap", display: "inline-block" }}
        >
          ¥ {formatPrice(value)}
        </Typography.Text>
      ),
    },
    {
      title: "操作",
      width: 60,
      render: (text: string, record: QuoteItem) => (
        <Button
          size="small"
          icon={<DeleteOutlined />}
          danger
          onClick={(e) => {
            e.stopPropagation();
            confirmDelete(record);
          }}
          disabled={isLocked}
          aria-label="删除"
        />
      ),
    },
  ];

  return (
    <>
      <SortableTable
        size="small"
        onDragEnd={handleDragEnd}
        loading={loading.add || loading.getQuote}
        columns={columns}
        dataSource={items}
        rowKey="id"
        scroll={{ x: 1000 }}
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        expandable={{
          // rowExpandable: (record) => {
          //   console.log(record, record.children && record.children.length > 0);
          //   return (record.children && record.children.length > 0) ?? false;
          // },
          showExpandColumn: false,
          indentSize: 50,
          defaultExpandAllRows: true,
          expandedRowKeys: expandedRowKeys,
        }}
        footer={() => (
          <Button
            type="dashed"
            onClick={() => {
              const lastItem = items[items.length - 1];
              if (
                items.length > 0 &&
                (!lastItem.productCategory ||
                  lastItem.productCategory.length === 0)
              ) {
                message.warning("请先填写当前行的产品信息");
                return;
              }
              addQuoteItem(quoteId);
            }}
            disabled={isLocked}
            block
            icon={<PlusOutlined />}
          >
            新增产品
          </Button>
        )}
      />
      <ProductConfigModal
        open={open}
        setOpen={setOpen}
        quoteId={quoteId}
        quoteItem={currentItem ?? items[0]}
      />
    </>
  );
};

const getDefaultExpandedRowKeys = (data: QuoteItem[]) => {
  return data
    .filter((item) => item.children && item.children.length > 0)
    .map((item) => item.id);
};
const formatValueWithUnit = (value: number | string, unit?: string) => {
  // 处理无效值
  if (value == null || value === "") return "-";

  // 数字类型处理
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  const isIntegerRequired = unit === "套";

  // 格式化数值
  const formattedValue = isIntegerRequired
    ? Math.round(numValue).toString()
    : numValue.toString();

  // 拼接单位
  return unit ? `${formattedValue}${unit}` : formattedValue;
};
export default DesktopQuoteItemsTable;
