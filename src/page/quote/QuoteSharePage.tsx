import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Spin, Button, Watermark } from "antd";
import ProductConfigurationForm from "@/components/quote/ProductConfigForm/ProductConfigurationForm";
import { QuoteItem } from "@/types/types";
import { QuoteService } from "@/api/services/quote.service";

const QuoteSharePage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [search] = useSearchParams();
  const pwd = search.get("pwd") ?? "";
  const [data, setData] = useState<{
    quoteItem?: QuoteItem;
    quoteId?: number;
    editable?: boolean;
    shareUserId?: string;
    shareUserName?: string;
  }>();
  const formRef = useRef<{ modelForm?: any }>(null);

  useEffect(() => {
    const load = async () => {
      if (!uuid) return;
      try {
        const res = await QuoteService.getShare(uuid, pwd);
        setData(res);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [uuid, pwd]);

  if (!data) return <Spin />;

  const handleSave = async (config: any) => {
    if (!uuid || !data.shareUserId || !config) return;
    try {
      await QuoteService.saveShare(uuid, data.shareUserId, { config });
    } catch (e) {
      console.error(e);
    }
  };

  const content = (
    <ProductConfigurationForm
      ref={formRef}
      quoteId={data.quoteId ?? 0}
      quoteItem={data.quoteItem}
      readOnly={!data.editable}
      showPrice={false}
    />
  );

  return (
    <Watermark content={`${data.shareUserName} (${data.shareUserId})`}>
      <div style={{ position: "relative" }}>
        {content}
        {data.editable && (
          <Button
            type="primary"
            onClick={() =>
              handleSave(formRef.current?.modelForm?.getFieldsValue())
            }
          >
            保存
          </Button>
        )}
      </div>
    </Watermark>
  );
};

export default QuoteSharePage;
