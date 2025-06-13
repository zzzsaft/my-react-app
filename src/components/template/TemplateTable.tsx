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
}

const TemplateTable: React.FC<TemplateTableProps> = ({
  templates,
  loading = false,
  selectedId,
  onSelect,
  onDoubleClick,
}) => {
  const columns = [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "名称", dataIndex: "name" },
    { title: "类型", dataIndex: "templateType" },
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
  ];

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
