import { Tabs, Typography } from "antd";
import { FormInstance } from "antd/lib";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import PriceForm from "../../quoteForm/PriceForm";
import DieForm from "../../quoteForm/dieForm/DieForm";
import { OtherForm } from "../../quoteForm/OtherForm";
import SmartRegulator from "../../quoteForm/SmartRegulator";
import { QuoteItem } from "../../../types/types";
import MeteringPumpForm from "../../quoteForm/MeteringPumpForm/MeteringPumpForm";
import FeedblockForm from "../../quoteForm/FeedblockForm/FeedblockForm";
import FilterForm from "../../quoteForm/FilterForm/FilterForm";

interface ProductConfigurationFormProps {
  quoteItem?: QuoteItem;
  quoteId: number;
  material?: string[];
  finalProduct?: string[];
  style?: any;
}
const ProductConfigurationForm = forwardRef(
  (
    {
      quoteItem,
      quoteId,
      material = [],
      finalProduct = [],
      style,
    }: ProductConfigurationFormProps,
    ref
  ) => {
    const priceFormRef = useRef<{ form: FormInstance }>(null);
    const modelFormRef = useRef<{ form: FormInstance }>(null);

    const [activeKey, setActiveKey] = useState("1");

    const generateName = () => {
      const category = quoteItem?.productCategory;
      if (!category) return "";

      if (category[0] === "平模") {
        const mat = material.join("");
        const final = finalProduct.join("");
        return `${mat}${final}模头`;
      }

      if (category.at(-1) === "共挤复合分配器") {
        const layers = modelFormRef.current?.form.getFieldValue("layers");
        const extruder =
          modelFormRef.current?.form.getFieldValue("extruderNumber");
        if (layers && extruder) {
          return `${layers}共挤复合分配器（${extruder}）`;
        }
      }

      if (category.at(-1) === "熔体计量泵") {
        const model = modelFormRef.current?.form.getFieldValue("model");
        if (model) {
          return `${model}熔体计量泵`;
        }
      }
      if (category.at(-1) === "过滤器") {
        const model = modelFormRef.current?.form.getFieldValue("model");
        const name = modelFormRef.current?.form.getFieldValue("name");
        if (model) {
          return `${model}${name}`;
        }
      }
      return "";
    };

    const setForm = () => {
      const category = quoteItem?.productCategory;
      if (category?.includes("平模"))
        return {
          form: (
            <DieForm
              quoteItemId={quoteItem?.id ?? 0}
              quoteId={quoteId}
              ref={modelFormRef}
            />
          ),
        };
      if (category?.includes("智能调节器"))
        return {
          form: <SmartRegulator ref={modelFormRef} />,
        };
      if (category?.at(1) == "熔体计量泵")
        return {
          form: (
            <MeteringPumpForm
              ref={modelFormRef}
              quoteId={quoteId}
              quoteItemId={quoteItem?.id ?? 0}
            />
          ),
        };
      if (category?.at(1) == "共挤复合分配器")
        return {
          form: (
            <FeedblockForm
              ref={modelFormRef}
              quoteId={quoteId}
              quoteItemId={quoteItem?.id ?? 0}
            />
          ),
        };
      if (category?.at(1) == "过滤器")
        return {
          form: (
            <FilterForm
              ref={modelFormRef}
              quoteId={quoteId}
              quoteItemId={quoteItem?.id ?? 0}
            />
          ),
        };

      return {
        form: <OtherForm ref={modelFormRef} />,
      };
    };
    // 暴露priceForm给祖父组件
    useImperativeHandle(ref, () => {
      return {
        priceForm: priceFormRef?.current?.form,
        modelForm: modelFormRef.current?.form,
        switchTab: (key: string) => setActiveKey(key),
      };
    });
    return (
      <Tabs
        centered
        activeKey={activeKey}
        onChange={setActiveKey}
        defaultActiveKey="1"
        style={{ ...style }}
        // destroyInactiveTabPane={false}
        items={[
          {
            label: "规格配置",
            key: "1",
            children: setForm().form,
            forceRender: true,
          },
          {
            label: "价格配置",
            key: "2",
            children: (
              <PriceForm ref={priceFormRef} onGenerateName={generateName} />
            ),
            forceRender: true,
          },
        ]}
      />
    );
  }
);
export default ProductConfigurationForm;
