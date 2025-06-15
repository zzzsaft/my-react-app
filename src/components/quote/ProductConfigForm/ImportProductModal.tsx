import React, { useEffect, useState } from "react";
import { Modal, Tabs, Table, Button } from "antd";
import { ProductService } from "@/api/services/product.service";
import ProductConfigurationForm from "./ProductConfigurationForm";
import ProductSearchBar from "../../general/ProductSearchBar";
import {
  QuoteItem,
  ProductSearchResult,
  QuoteTemplate,
} from "../../../types/types";
import { useTemplateStore } from "../../../store/useTemplateStore";
import TemplateTable from "../../template/TemplateTable";
import TemplateCreateModal from "../../template/TemplateCreateModal";
import TemplateConfigModal from "../../template/TemplateConfigModal";

interface ImportProductModalProps {
  open: boolean;
  onCancel: () => void;
  onImport: (item: QuoteItem) => void;
  formType?: string;
}

const ImportProductModal: React.FC<ImportProductModalProps> = ({
  open,
  onCancel,
  onImport,
  formType,
}) => {
  const isOtherForm = formType === "OtherForm";
  const [mode, setMode] = useState<"template" | "other">(
    isOtherForm ? "other" : "template"
  );
  const [list, setList] = useState<ProductSearchResult[]>([]);
  const [selected, setSelected] = useState<ProductSearchResult>();
  const [selectedTemplate, setSelectedTemplate] = useState<QuoteTemplate>();
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [currentTpl, setCurrentTpl] = useState<
    QuoteTemplate | QuoteItem | null
  >(null);
  const {
    templates,
    loading: tplLoading,
    refreshTemplates,
  } = useTemplateStore();

  useEffect(() => {
    if (isOtherForm) {
      setMode("other");
    }
  }, [isOtherForm]);

  useEffect(() => {
    if (open && mode === "template") {
      refreshTemplates(formType);
    }
  }, [open, mode, formType, refreshTemplates]);

  const handleSearch = async (field: "code" | "name", keyword: string) => {
    setLoading(true);
    try {
      const data = await ProductService.searchProducts(
        keyword,
        field,
        formType
      );
      setList(data);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (mode === "template" && selectedTemplate) {
      onImport({
        ...selectedTemplate,
        config: selectedTemplate.config,
      } as any);
    } else if (mode === "other" && selected) {
      onImport({
        // ...selectedTemplate,
        config: selected.item.config,
      } as any);
      // onImport(selected.item);
    }
  };

  return (
    <>
      <Modal
        width={800}
        open={open}
        title="从模版导入"
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            取消
          </Button>,
          <Button
            key="import"
            type="primary"
            onClick={handleImport}
            disabled={mode === "template" ? !selectedTemplate : !selected}
          >
            导入
          </Button>,
        ]}
        destroyOnHidden
        forceRender
      >
        <Tabs
          activeKey={mode}
          onChange={(key) => setMode(key as any)}
          items={[
            {
              key: "template",
              label: "从模版导入",
              disabled: isOtherForm,
              children: (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Button
                      type="primary"
                      onClick={() => setCreateOpen(true)}
                      disabled={isOtherForm}
                    >
                      创建模版
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => refreshTemplates(formType)}
                      loading={tplLoading}
                    >
                      刷新
                    </Button>
                  </div>
                  <TemplateTable
                    templates={templates}
                    loading={tplLoading}
                    selectedId={selectedTemplate?.id}
                    onSelect={setSelectedTemplate}
                    onDoubleClick={(tpl) => {
                      console.log(tpl);
                      setCurrentTpl(tpl);
                      setConfigOpen(true);
                    }}
                    showType={false}
                  />
                  {/* {selectedTemplate && (
                    <div style={{ marginTop: 16 }}>
                      <ProductConfigurationForm
                        quoteId={0}
                        quoteItem={selectedTemplate as any}
                        formType={selectedTemplate.templateType}
                        showPrice={false}
                        readOnly={true}
                        quoteTemplate={selectedTemplate}
                      />
                    </div>
                  )} */}
                </div>
              ),
            },
            {
              key: "other",
              label: "从其他产品导入",
              children: (
                <div>
                  <ProductSearchBar onSearch={handleSearch} loading={loading} />
                  <Table
                    style={{ marginTop: 16 }}
                    dataSource={list}
                    rowKey={(row) => row.item.id}
                    pagination={false}
                    loading={loading}
                    onRow={(record) => ({
                      onClick: () => setSelected(record),
                      onDoubleClick: () => {
                        setCurrentTpl(record.item);
                        setConfigOpen(true);
                      },
                      style: {
                        cursor: "pointer",
                        backgroundColor:
                          selected?.item.id === record.item.id
                            ? "#e6f4ff"
                            : undefined,
                      },
                    })}
                    columns={[
                      { title: "产品名称", dataIndex: ["item", "productName"] },
                      { title: "客户", dataIndex: "customer" },
                      {
                        title: "适用原料",
                        dataIndex: "material",
                        render: (v: string[]) => v.join("/"),
                      },
                      { title: "行业", dataIndex: "industry" },
                      { title: "最终产品", dataIndex: "finalProduct" },
                      {
                        title: "下单日期",
                        dataIndex: "orderDate",
                        render: (d: string) =>
                          d ? new Date(d as any).toLocaleDateString() : "",
                      },
                    ]}
                  />
                  {selected && (
                    <div style={{ marginTop: 16 }}>
                      <ProductConfigurationForm
                        quoteId={0}
                        quoteItem={selected.item}
                        showPrice={false}
                        readOnly={true}
                      />
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Modal>
      <TemplateCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        formType={formType}
      />
      <TemplateConfigModal
        open={configOpen}
        template={currentTpl}
        onClose={() => setConfigOpen(false)}
        readOnly
      />
    </>
  );
};

export default ImportProductModal;
