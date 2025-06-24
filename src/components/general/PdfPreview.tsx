import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface PdfPreviewProps {
  open: boolean;
  blob: Blob | null;
  onClose: () => void;
  fileName?: string;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({
  open,
  blob,
  onClose,
  fileName = "file.pdf",
}) => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (blob) {
      const objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [blob]);

  const handleDownload = () => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      width="80%"
      style={{ top: 20 }}
      destroyOnHidden
    >
      <div style={{ position: "relative", height: "80vh" }}>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          style={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}
        >
          下载
        </Button>
        {url && (
          <iframe
            src={url}
            title="PDF Preview"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        )}
      </div>
    </Modal>
  );
};

export default PdfPreview;
