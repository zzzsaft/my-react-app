import { Form, FormInstance } from "antd";
import { forwardRef, useImperativeHandle } from "react";
import { Product } from "./Product";
import { DieBody } from "./DieBody";
import { DieInstall } from "./DieInstall";
import { TemperatureControl } from "./TemperatureControl";
import { SurfaceTreatment } from "./SurfaceTreatment";
import { SameProduct } from "./SameProduct";
import ProForm from "@ant-design/pro-form";
import TextArea from "antd/es/input/TextArea";
import useProductActionModal from "../../../hook/showProductActionModal";
import { useQuoteStore } from "../../../store/useQuoteStore";
interface PriceFormRef {
  form: FormInstance; // 明确定义暴露的form实例
}

const DieForm = forwardRef(
  ({ quoteId, quoteItemId }: { quoteId: number; quoteItemId: number }, ref) => {
    const [form] = Form.useForm();
    const quoteItems = useQuoteStore
      .getState()
      .quotes.find((quote) => quote.id === quoteId)?.items;
    const { showProductActionModal } = useProductActionModal();

    // 暴露form实例给父组件
    useImperativeHandle(ref, () => ({
      form,
    }));

    const addProp: any = (
      productCategory: string[],
      key: string,
      value: any
    ) => ({
      method: "add",
      quoteId,
      quoteItems,
      productCategory,
      productName: productCategory.at(-1) ?? "",
      linkId: quoteItemId,
      source: {
        name: productCategory.at(-1),
        value,
        key,
      },
    });

    const deleteProp: any = (productCategory: string[]) => ({
      method: "delete",
      linkId: quoteItemId,
      quoteId,
      quoteItems,
      productCategory,
      items: [
        {
          name: productCategory.at(-1),
        },
      ],
    });

    const handleDieWidth = (value: string) => {
      const width = Number(value?.split("-")[0]);
      const zone = nearestOdd(width);
      form.setFieldValue("heatingZones", zone);
      form.setFieldValue("powerCableLength", width <= 1500 ? 3 : 5);
      form.setFieldValue("glassHeatingZones", zone);
    };

    const handleHeatingZones = (value: number) => {
      form.setFieldValue("glassHeatingZones", value);
    };

    const handleCompositeStructure = (value: string) => {
      const list = value.split("").map((s: any) => ({ layer: s }));
      form.setFieldValue("screwList", list);
    };

    const handleHasCart = async (value: string) => {
      if (value === "有") {
        const result = await showProductActionModal(
          addProp(["模具配件", "模具拆装小车"], "hasCart", "无")
        );
        if (!result.result) form.setFieldValue("hasCart", "无");
        return;
      }

      const result = await showProductActionModal(
        deleteProp(["模具配件", "模具拆装小车"])
      );
      if (!result.result) form.setFieldValue("hasCart", "有");
    };

    const handleSmartRegulator = async (value: boolean) => {
      if (value) {
        const result = await showProductActionModal(
          addProp(["模具配件", "智能调节器"], "smartRegulator", false)
        );
        if (!result.result) form.setFieldValue("smartRegulator", false);
        return;
      }

      const result = await showProductActionModal(
        deleteProp(["模具配件", "智能调节器"])
      );
      if (!result.result) form.setFieldValue("smartRegulator", true);
    };

    const handleThermalInsulation = async (value: boolean) => {
      if (value) {
        const result = await showProductActionModal(
          addProp(["模具配件", "隔热装置"], "haveThermalInsulation", false)
        );
        if (!result.result) form.setFieldValue("haveThermalInsulation", false);
        return;
      }

      const result = await showProductActionModal(
        deleteProp(["模具配件", "隔热装置"])
      );
      if (!result.result) form.setFieldValue("haveThermalInsulation", true);
    };

    const fieldHandlers: Record<string, (value: any) => void | Promise<void>> = {
      dieWidth: handleDieWidth,
      heatingZones: handleHeatingZones,
      compositeStructure: handleCompositeStructure,
      hasCart: handleHasCart,
      smartRegulator: handleSmartRegulator,
      haveThermalInsulation: handleThermalInsulation,
    };

    const handleFieldsChange = async (changedFields: any) => {
      for (const [key, value] of Object.entries(changedFields)) {
        const handler = fieldHandlers[key];
        if (handler) await handler(value);
      }
    };

    return (
      <>
        <ProForm
          layout={"vertical"}
          form={form}
          submitter={false}
          onValuesChange={handleFieldsChange}
        >
          <SameProduct />
          <Form.Item noStyle dependencies={["hasCart"]}>
            {({ getFieldValue }) => {
              const isBuySameProduct = getFieldValue("isBuySameProduct"); // 获取 hasCart 的值
              return !isBuySameProduct ? (
                <>
                  <Product />
                  <DieBody />
                  <DieInstall />
                  <TemperatureControl />
                  <SurfaceTreatment />
                </>
              ) : null;
            }}
          </Form.Item>

          <Form.Item label="其他备注" name="remark">
            <TextArea />
          </Form.Item>
        </ProForm>
        {/* <FloatButton.BackTop visibilityHeight={0} /> */}
      </>
    );
  }
);

export default DieForm;
const nearestOdd = (n: number): number => {
  const x = n / 200;
  const floor = Math.floor(x) | 1; // 向下取最近的奇数
  const ceil = Math.ceil(x) | 1; // 向上取最近的奇数
  return x - floor < ceil - x ? floor : ceil;
};
