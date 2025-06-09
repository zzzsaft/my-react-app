import { Form, FormInstance } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
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

    const handleFieldsChange = async (changedFields: any) => {
      if (changedFields.dieWidth) {
        const width = Number(changedFields.dieWidth?.split("-")[0]);
        const zone = nearestOdd(width);
        form.setFieldValue("heatingZones", zone);
        form.setFieldValue("powerCableLength", width <= 1500 ? 3 : 5);
        form.setFieldValue("glassHeatingZones", zone);
      }
      if (changedFields.heatingZones) {
        form.setFieldValue("glassHeatingZones", changedFields.heatingZones);
      }
      if (changedFields.compositeStructure != null) {
        const structs = changedFields.compositeStructure.split("");
        const list = structs.map((s: any) => {
          return { layer: s };
        });
        form.setFieldValue("screwList", list);
      }
      if (changedFields.hasCart != null) {
        if (changedFields.hasCart == "有") {
          const result = await showProductActionModal({
            method: "add",
            quoteId,
            quoteItems,
            productCategory: ["模具配件", "模具拆装小车"],
            productName: "模具拆装小车",
            linkId: quoteItemId,
            source: {
              name: "模具固定小车",
              value: "无",
              key: "hasCart",
            },
          });
          if (!result.result) form.setFieldValue("hasCart", "无");
        } else {
          const result = await showProductActionModal({
            method: "delete",
            linkId: quoteItemId,
            quoteId,
            quoteItems,
            productCategory: ["模具配件", "模具拆装小车"],
            items: [
              {
                name: "模具拆装小车",
              },
            ],
          });
          if (!result.result) form.setFieldValue("hasCart", "有");
        }
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
