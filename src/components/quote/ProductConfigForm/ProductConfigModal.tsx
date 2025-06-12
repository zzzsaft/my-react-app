import { Modal, Button, Skeleton } from "antd";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQuoteStore } from "../../../store/useQuoteStore";
import { FormInstance } from "antd/lib";
import ProductConfigurationForm from "./ProductConfigurationForm";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { QuoteItem } from "../../../types/types";

interface ProductConfigModalProps {
  open: boolean;
  setOpen: (bool: boolean) => void;
  quoteId: number;
  quoteItem: QuoteItem | undefined;
}

const ProductConfigModal: React.FC<ProductConfigModalProps> = ({
  open,
  setOpen,
  quoteId,
  quoteItem,
}) => {
  const onUpdateItem = useQuoteStore((state) => state.updateQuoteItem);
  const material = useQuoteStore(
    (state) => state.quotes.find((q) => q.id == quoteId)?.material
  );
  const finalProduct = useQuoteStore(
    (state) => state.quotes.find((q) => q.id == quoteId)?.finalProduct
  );
  const formRef = useRef<{
    priceForm: FormInstance;
    modelForm: FormInstance;
    switchTab: (key: string) => void;
  }>(null);
  const priceForm = formRef.current?.priceForm;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!quoteItem || !open) return;
    setLoading(true);
    const { config, ...otherValue } = quoteItem;

    const basicValues = {
      // ...otherValue,
      brand: quoteItem.brand,
      productName: quoteItem.productName || "",
      quantity: quoteItem.quantity || 0,
      unitPrice: quoteItem.unitPrice || 0,
      discountRate: quoteItem.discountRate || 0,
      subtotal: quoteItem.subtotal || 0,
    };

    const formValues = {
      ...(quoteItem.config || {}),
    };
    if (!formValues.material || formValues.material?.length == 0) {
      formValues["material"] = material;
    }
    // 当表单尚未挂载时，循环等待直到获取到 ref
    let retryTimer: number;
    const setFormFields = () => {
      if (!formRef.current) {
        retryTimer = window.setTimeout(setFormFields, 100);
        return;
      }

      formRef.current.priceForm?.setFieldsValue(basicValues);
      formRef.current.modelForm?.setFieldsValue(formValues);
      console.log(formRef.current.modelForm?.getFieldsValue());
      setLoading(false);
    };

    // 添加延迟确保表单已渲染
    const timer = setTimeout(setFormFields, 100);
    return () => {
      clearTimeout(timer);
      clearTimeout(retryTimer);

      setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, quoteItem]);

  const handleOk = async () => {
    try {
      const form = await formRef.current?.modelForm?.validateFields();
      try {
        const price = await priceForm?.validateFields();
        save();
      } catch (error: any) {
        formRef.current?.switchTab("2");
        console.error("Validation failed:", error);
      }
    } catch (error: any) {
      formRef.current?.switchTab("1");
      console.error("Validation failed:", error);
    }
  };

  const save = async () => {
    const form = formRef.current?.modelForm;
    try {
      await form?.validateFields();
      await priceForm?.validateFields();
    } catch (e) {
      // console.log(e);
    }
    const errors = form?.getFieldsError();
    const priceErrors = priceForm?.getFieldsError();
    const isCompleted =
      errors?.every((err) => err.errors.length == 0) &&
      priceErrors?.every((err) => err.errors.length == 0);
    const values = form?.getFieldsValue();
    if (values?.gifts && Array.isArray(values.gifts)) {
      values.gifts = values.gifts.map((g: any) => {
        const q = Number(g?.quantity) || 0;
        const p = Number(g?.unitPrice) || 0;
        const subtotal = q && p ? q * p : 0;
        return { ...g, subtotal };
      });
      values.giftsTotal = values.gifts.reduce(
        (sum: number, g: any) => sum + (g.subtotal || 0),
        0
      );
    }
    const price = priceForm?.getFieldsValue();
    const config = { ...values };
    if (quoteItem?.id) {
      onUpdateItem(quoteId, quoteItem?.id, {
        ...price,
        config,
        isCompleted,
        isCategoryLocked: true,
      });
    }
    setOpen(false);
  };

  return (
    <>
      <Modal
        style={{ overflow: "auto" }}
        title={`${quoteItem?.productCategory?.join("/")}`}
        width={800}
        open={open}
        afterClose={() => {
          formRef.current?.modelForm?.resetFields();
          formRef.current?.priceForm.resetFields();
        }}
        destroyOnHidden
        forceRender
        // afterOpenChange={handleAfterOpenChange}
        onCancel={() => save()}
        footer={[
          <Button key="save" onClick={() => save()}>
            暂存
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            保存配置
          </Button>,
        ]}
      >
        {loading && (
          <div style={{ padding: 24 }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        )}
        <ProductConfigurationForm
          quoteId={quoteId}
          quoteItem={quoteItem}
          ref={formRef}
          style={{ display: loading ? "none" : "block" }}
          material={material}
          finalProduct={finalProduct}
        />
      </Modal>
    </>
  );
};

export default ProductConfigModal;
