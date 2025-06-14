import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { QuoteTemplate } from "../../types/types";
import { useTemplateStore } from "../../store/useTemplateStore";
import TemplateTable from "../../components/template/TemplateTable";
import TemplateCreateModal from "../../components/template/TemplateCreateModal";
import TemplateConfigModal from "../../components/template/TemplateConfigModal";
import { useAuthStore } from "../../store/useAuthStore";

const TemplateListPage: React.FC = () => {
  const { templates, loading, refreshTemplates, fetchTemplates } = useTemplateStore();
  const { userid } = useAuthStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const [open, setOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [currentTpl, setCurrentTpl] = useState<QuoteTemplate | null>(null);

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
        onDoubleClick={(tpl) => {
          setCurrentTpl(tpl);
          setConfigOpen(true);
        }}
      />
      <TemplateCreateModal open={open} onClose={() => setOpen(false)} />
      <TemplateConfigModal
        open={configOpen}
        template={currentTpl}
        onClose={() => setConfigOpen(false)}
        readOnly={currentTpl?.creatorId !== userid?.id}
      />
    </div>
  );
};

export default TemplateListPage;
