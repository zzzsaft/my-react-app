import React, { useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import SortableTable from "../general/SortableTable";
import { Clause } from "../../types/types";

interface TermsTableProps {
  value: Clause[];
  onChange?: (data: Clause[]) => void;
}

const TermsTable: React.FC<TermsTableProps> = ({ value, onChange }) => {
  const [data, setData] = useState<Clause[]>(value);

  useEffect(() => {
    setData(value);
  }, [value]);
  const [editing, setEditing] = useState<Clause | null>(null);
  const [text, setText] = useState("");

  const triggerChange = (list: Clause[]) => {
    setData(list);
    onChange?.(list);
  };

  const handleDragEnd = (list: Clause[]) => {
    triggerChange(list);
  };

  const handleDelete = (id: number) => {
    triggerChange(data.filter((d) => d.id !== id));
  };

  const handleEdit = (record: Clause) => {
    setEditing(record);
    setText(record.content);
  };

  const saveEdit = () => {
    if (!editing) return;
    const newData = data.map((item) =>
      item.id === editing.id ? { ...item, content: text } : item
    );
    triggerChange(newData);
    setEditing(null);
  };

  const columns = [
    { title: "条约标题", dataIndex: "title", width: "30%" },
    { title: "条约内容", dataIndex: "content" },
    {
      title: "操作",
      width: 80,
      render: (_: any, record: Clause) => (
        <>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <SortableTable
        columns={columns}
        dataSource={data}
        onDragEnd={handleDragEnd}
        pagination={false}
      />
      <Modal
        open={!!editing}
        title="编辑条约内容"
        onOk={saveEdit}
        onCancel={() => setEditing(null)}
      >
        <Input.TextArea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default TermsTable;
