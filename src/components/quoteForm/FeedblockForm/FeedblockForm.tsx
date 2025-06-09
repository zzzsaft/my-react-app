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
import { useProductStore } from "../../../store/useProductStore";
import { ModelOption } from "../MeteringPumpForm/ModelOption";
import { ModelSelection } from "./ModelSelection";
interface PriceFormRef {
  form: FormInstance; // 明确定义暴露的form实例
}

const FeedblockForm = forwardRef(
  ({ quoteId, quoteItemId }: { quoteId: number; quoteItemId: number }, ref) => {
    const [form] = Form.useForm();
    const pump = useProductStore((state) => state.pump);
    // 暴露form实例给父组件
    useImperativeHandle(ref, () => ({
      form,
    }));

    const handleFieldsChange = async (changedFields: any) => {
      // if (changedFields.type) {

      // }
      if (changedFields.型号 || changedFields.shearSensitivity) {
        const model = form.getFieldValue("型号");
        const shearSensitivity = form.getFieldValue("shearSensitivity");
        if (!model || !shearSensitivity) return;
        const selectedPump = pump.find(
          (p) =>
            p.shearSensitivity == shearSensitivity &&
            p.model == model.replace("-NL", "")
        );
        form.setFieldValue("pumpage", selectedPump?.pumpage);
        form.setFieldValue("heatingPower", selectedPump?.heatingPower);
        form.setFieldValue("production", selectedPump?.production);
        form.setFieldValue("rotateSpeed", selectedPump?.rotateSpeed);
      }

      if (changedFields.compositeStructure != null) {
        const structs = changedFields.compositeStructure.split("");
        const list = structs.map((s: any) => {
          return { layer: s };
        });
        form.setFieldValue("screwList", list);
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
          {/* <ModelOption /> */}
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

export default FeedblockForm;
