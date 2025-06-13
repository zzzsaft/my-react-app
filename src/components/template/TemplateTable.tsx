import React from "react";
import { Table } from "antd";
import MemberAvatar from "../general/MemberAvatar";
import { QuoteTemplate } from "../../types/types";

interface TemplateTableProps {
  templates: QuoteTemplate[];
  loading?: boolean;
  selectedId?: string;
  onSelect?: (tpl: QuoteTemplate) => void;
  onDoubleClick?: (tpl: QuoteTemplate) => void;
  showType?: boolean;
}

const TEMPLATE_TYPE_MAP: Record<string, string> = {
  DieForm: "平模",
  SmartRegulator: "智能调节器",
  MeteringPumpForm: "熔体计量泵",
  FeedblockForm: "共挤复合分配器",
  FilterForm: "过滤器",
  ThicknessGaugeForm: "测厚仪",
  HydraulicStationForm: "液压站",
  PartsForm: "小配件",
  OtherForm: "其他",
};

const TemplateTable: React.FC<TemplateTableProps> = ({
  templates,
  loading = false,
  selectedId,
  onSelect,
  onDoubleClick,
  showType = true,
}) => {
  const columns = [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "名称", dataIndex: "name" },
    { title: "描述", dataIndex: "description" },
    showType
      ? {
          title: "类型",
          dataIndex: "templateType",
          render: (v: string) => TEMPLATE_TYPE_MAP[v] || v,
        }
      : null,
    {
      title: "创建人",
      dataIndex: "creatorId",
      render: (id: string) => id && <MemberAvatar id={id} />,
      width: 120,
    },
    {
      title: "适用材料",
      dataIndex: "materials",
      render: (v: string[]) => v?.join("/") || "",
    },
    {
      title: "行业",
      dataIndex: "industries",
      render: (v: string[]) => v?.join("/") || "",
    },
  ].filter(Boolean);

  return (
    <Table
      rowKey="id"
      dataSource={templates}
      columns={columns as any}
      loading={loading}
      pagination={false}
      onRow={(record) => ({
        onClick: () => onSelect?.(record),
        onDoubleClick: () => onDoubleClick?.(record),
        style: {
          cursor: onSelect ? "pointer" : undefined,
          backgroundColor: selectedId === record.id ? "#e6f4ff" : undefined,
        },
      })}
    />
  );
};

export default TemplateTable;
