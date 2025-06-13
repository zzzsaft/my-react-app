import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useTemplateStore } from "../../store/useTemplateStore";
import TemplateTable from "../../components/template/TemplateTable";
import TemplateCreateModal from "../../components/template/TemplateCreateModal";
import { useNavigate } from "react-router-dom";

const TemplateListPage: React.FC = () => {
  const navigate = useNavigate();
  const { templates, loading, refreshTemplates, fetchTemplates } = useTemplateStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const [open, setOpen] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setOpen(true)}>
          创建模版
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => refreshTemplates()}>
          刷新
        </Button>
      </div>
      <TemplateTable
        templates={templates}
        loading={loading}
        onDoubleClick={(tpl) => navigate(`/template/${tpl.id}`)}
      />
      <TemplateCreateModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default TemplateListPage;
