import { QuestionCircleOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";

export const TooltipLabel = ({
  label,
  tooltip,
}: {
  label: string;
  tooltip: string;
}) => {
  return (
    <Space>
      {label}
      <Tooltip title={tooltip}>
        <QuestionCircleOutlined />
      </Tooltip>
    </Space>
  );
};
