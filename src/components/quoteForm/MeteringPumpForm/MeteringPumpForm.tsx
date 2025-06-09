import { Form, FormInstance } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Product } from "../dieForm/Product";
import { DieBody } from "../dieForm/DieBody";
import { DieInstall } from "../dieForm/DieInstall";
import { TemperatureControl } from "../dieForm/TemperatureControl";
import { SurfaceTreatment } from "../dieForm/SurfaceTreatment";
import { SameProduct } from "../dieForm/SameProduct";
import ProForm from "@ant-design/pro-form";
import TextArea from "antd/es/input/TextArea";
import useProductActionModal from "../../../hook/showProductActionModal";
import { useQuoteStore } from "../../../store/useQuoteStore";
import { ModelSelection } from "./ModelSelection";
import { useProductStore } from "../../../store/useProductStore";
import { ModelOption } from "./ModelOption";
interface PriceFormRef {
  form: FormInstance; // 明确定义暴露的form实例
}

const MeteringPumpForm = forwardRef(
  ({ quoteId, quoteItemId }: { quoteId: number; quoteItemId: number }, ref) => {
    const [form] = Form.useForm();
    const quoteItems = useQuoteStore
      .getState()
      .quotes.find((quote) => quote.id === quoteId)?.items;
    const { showProductActionModal } = useProductActionModal();
    const pump = useProductStore((state) => state.pump);
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
    const deleteProp: any = (productCategory: string[]) =>
      ({
        method: "delete",
        linkId: quoteItemId,
        quoteId,
        quoteItems,
        productCategory: productCategory,
        items: [
          {
            name: productCategory.at(-1),
          },
        ],
      } as any);
    // 暴露form实例给父组件
    useImperativeHandle(ref, () => ({
      form,
    }));

    const updateModel = () => {
      let model: string = form.getFieldValue("model") ?? "";
      const type = form.getFieldValue("type");
      const isCustomization = form.getFieldValue("isCustomization") === "定制";

      model = model.replace("-NL", "").replace("（定制）", "");

      if (type === "内冷式计量泵") model += "-NL";
      if (isCustomization) model += "（定制）";

      form.setFieldsValue({ model });
    };

    const syncPumpInfo = () => {
      const model = form.getFieldValue("model");
      const shearSensitivity = form.getFieldValue("shearSensitivity");
      if (!model || !shearSensitivity) return;

      const selectedPump = pump.find(
        (p) =>
          p.shearSensitivity === shearSensitivity &&
          p.model === model.replace("-NL", "").replace("（定制）", "")
      );

      form.setFieldValue("pumpage", selectedPump?.pumpage);
      form.setFieldValue("heatingPower", selectedPump?.heatingPower);
      form.setFieldValue("production", selectedPump?.production);
      form.setFieldValue("rotateSpeed", selectedPump?.rotateSpeed);
    };

    const handlePumpBracket = async (value: boolean) => {
      if (value) {
        const result = await showProductActionModal(
          addProp(["模具配件", "计量泵支架"], "pumpBracket", false)
        );
        if (!result.result) form.setFieldValue("pumpBracket", false);
        return;
      }

      const result = await showProductActionModal(
        deleteProp(["模具配件", "计量泵支架"])
      );
      if (!result.result) form.setFieldValue("pumpBracket", true);
    };

    const fieldHandlers: Record<string, (value: any) => void | Promise<void>> = {
      type: updateModel,
      isCustomization: updateModel,
      model: syncPumpInfo,
      shearSensitivity: syncPumpInfo,
      pumpBracket: handlePumpBracket,
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
          <ModelSelection />
          <ModelOption />
          {/* <Form.Item noStyle dependencies={["hasCart"]}>
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
          </Form.Item> */}

          <Form.Item label="其他备注" name="remark">
            <TextArea />
          </Form.Item>
        </ProForm>
        {/* <FloatButton.BackTop visibilityHeight={0} /> */}
      </>
    );
  }
);

export default MeteringPumpForm;
const nearestOdd = (n: number): number => {
  const x = n / 200;
  const floor = Math.floor(x) | 1; // 向下取最近的奇数
  const ceil = Math.ceil(x) | 1; // 向上取最近的奇数
  return x - floor < ceil - x ? floor : ceil;
};
