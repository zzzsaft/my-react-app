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

interface ProductConfigurationFormProps {
  quoteItem?: QuoteItem;
  quoteId: number;
}
const ProductConfigurationForm = forwardRef(
  ({ quoteItem, quoteId }: ProductConfigurationFormProps, ref) => {
    const priceFormRef = useRef<{ form: FormInstance }>(null);
    const modelFormRef = useRef<{ form: FormInstance }>(null);
    const dieFormRef = useRef<{ form: FormInstance }>(null);
    const smartRegulatorFormRef = useRef<{ form: FormInstance }>(null);
    const remarkFormRef = useRef<{ form: FormInstance }>(null);
    const meteringPumpFormRef = useRef<{ form: FormInstance }>(null);
    const feedblockFormRef = useRef<{ form: FormInstance }>(null);
    const [activeKey, setActiveKey] = useState("1");

    const setForm = () => {
      const category = quoteItem?.productCategory;
      if (category?.[0] == "平模")
        return {
          form: (
            <DieForm
              quoteItemId={quoteItem?.id ?? 0}
              quoteId={quoteId}
              ref={modelFormRef}
            />
          ),
          ref: dieFormRef.current?.form,
        };
      if (category?.[1] == "智能调节器")
        return {
          form: <SmartRegulator ref={modelFormRef} />,
          ref: smartRegulatorFormRef.current?.form,
        };
      if (category?.[1] == "熔体计量泵")
        return {
          form: (
            <MeteringPumpForm
              ref={modelFormRef}
              quoteId={quoteId}
              quoteItemId={quoteItem?.id ?? 0}
            />
          ),
          ref: meteringPumpFormRef.current?.form,
        };
      if (category?.at(-1) == "共挤复合分配器")
        return {
          form: (
            <FeedblockForm
              ref={modelFormRef}
              quoteId={quoteId}
              quoteItemId={quoteItem?.id ?? 0}
            />
          ),
          ref: feedblockFormRef.current?.form,
        };

      return {
        form: <OtherForm ref={modelFormRef} />,
        ref: remarkFormRef.current?.form,
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
            children: <PriceForm ref={priceFormRef} />,
            forceRender: true,
          },
        ]}
      />
    );
  }
);
export default ProductConfigurationForm;
