import React, { useEffect, useState } from "react";
import { Popover, Button, Switch, Input, Space, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { ShareAltOutlined } from "@ant-design/icons";
import { QuoteItem } from "@/types/types";
import { QuoteService } from "@/api/services/quote.service";

interface QuoteSharePopoverProps {
  quoteItem?: QuoteItem;
}

const QuoteSharePopover: React.FC<QuoteSharePopoverProps> = ({ quoteItem }) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [expireDate, setExpireDate] = useState<Dayjs>(dayjs().add(1, "day"));
  const [viewLink, setViewLink] = useState("");
  const [editLink, setEditLink] = useState("");

  const base = typeof window !== "undefined" ? window.location.origin : "";

  const refreshLinks = async (date: Dayjs) => {
    const days = date.startOf("day").diff(dayjs().startOf("day"), "day");
    if (!quoteItem) return;
    setLoading(true);
    try {
      const view = await QuoteService.createShareLink(quoteItem.id, days, false);
      const edit = await QuoteService.createShareLink(quoteItem.id, days, true);
      setViewLink(`${base}/quote/share/${view.uuid}`);
      setEditLink(`${base}/quote/share/${edit.uuid}`);
    } finally {
      setLoading(false);
    }
  };

  const disableShare = async () => {
    if (!quoteItem) return;
    setLoading(true);
    try {
      await QuoteService.disableShare(quoteItem.id);
    } finally {
      setViewLink("");
      setEditLink("");
      setLoading(false);
    }
  };

  const loadShareInfo = async () => {
    if (!quoteItem) return;
    setLoading(true);
    try {
      const info = await QuoteService.getShareLinks(quoteItem.id);
      if (info) {
        setEnabled(true);
        setViewLink(`${base}/quote/share/${info.viewUuid}`);
        setEditLink(`${base}/quote/share/${info.editUuid}`);
        if (info.expireDays)
          setExpireDate(dayjs().add(info.expireDays, "day"));
      } else {
        setEnabled(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = async (checked: boolean) => {
    if (checked) {
      await refreshLinks(expireDate);
    } else {
      await disableShare();
    }
    setEnabled(checked);
  };

  useEffect(() => {
    if (visible) {
      loadShareInfo();
    }
  }, [visible]);

  useEffect(() => {
    if (enabled && visible) {
      refreshLinks(expireDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expireDate]);

  const content = (
    <Space direction="vertical">
      <div>
        <Switch checked={enabled} onChange={handleSwitch} loading={loading} /> 分享
      </div>
      {enabled && (
        <>
          <DatePicker
            value={expireDate}
            onChange={(d) => d && setExpireDate(d)}
            disabledDate={(current) => {
              const diff = current
                ? current.startOf("day").diff(dayjs().startOf("day"), "day")
                : 0;
              return diff < 1 || diff > 3;
            }}
          />
          <Input readOnly value={viewLink} addonBefore="查看" />
          <Input readOnly value={editLink} addonBefore="编辑" />
        </>
      )}
    </Space>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={visible}
      onOpenChange={setVisible}
    >
      <Button type="link" icon={<ShareAltOutlined />} />
    </Popover>
  );
};

export default QuoteSharePopover;

