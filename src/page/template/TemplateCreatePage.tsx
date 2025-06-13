import React, { useEffect, useRef, useState } from "react";
import { Button, App } from "antd";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import TemplateCreate, { TemplateCreateRef } from "../../components/template/TemplateCreate";
import { TemplateService } from "../../api/services/template.service";
import { QuoteTemplate } from "../../types/types";
import { useTemplateStore } from "../../store/useTemplateStore";

const TemplateCreatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const formTypeParam = searchParams.get("formType") || undefined;
  const ref = useRef<TemplateCreateRef>(null);
  const navigate = useNavigate();
  const { refreshTemplates } = useTemplateStore();
  const { message } = App.useApp();
  const [initialValues, setInitialValues] = useState<Partial<QuoteTemplate>>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      setInitialValues(undefined);
      return;
    }
    (async () => {
      const data = await TemplateService.getTemplate(id);
      setInitialValues(data);
    })();
  }, [id]);

  const handleSubmit = async () => {
    if (!ref.current) return;
    const data = await ref.current.getData();
    setSaving(true);
    try {
      if (id) {
        await TemplateService.updateTemplate(id, data);
      } else {
        await TemplateService.createTemplate(data);
      }
      await refreshTemplates();
      message.success("保存成功");
      navigate("/template");
    } catch (err) {
      console.error(err);
      message.error("保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <TemplateCreate ref={ref} initialValues={initialValues} formType={formTypeParam} />
      <div style={{ marginTop: 16 }}>
        <Button type="primary" onClick={handleSubmit} loading={saving}>
          保存
        </Button>
      </div>
    </div>
  );
};

export default TemplateCreatePage;
