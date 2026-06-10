import React from "react";

type IconProps = React.HTMLAttributes<HTMLSpanElement> & {
  style?: React.CSSProperties;
};

const makeIcon =
  (symbol: string) =>
  ({ className, style, ...props }: IconProps) => (
    <span
      aria-hidden="true"
      className={className}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", ...style }}
      {...props}
    >
      {symbol}
    </span>
  );

export const MenuFoldOutlined = makeIcon("=");
export const MenuUnfoldOutlined = makeIcon("=");
export const UserOutlined = makeIcon("U");
export const HomeOutlined = makeIcon("H");
export const SettingOutlined = makeIcon("*");
export const LogoutOutlined = makeIcon("<");
export const SearchOutlined = makeIcon("?");
export const PlusOutlined = makeIcon("+");
export const DeleteOutlined = makeIcon("x");
export const EditOutlined = makeIcon("e");
export const LinkOutlined = makeIcon(">");
export const QuestionCircleOutlined = makeIcon("?");
export const HolderOutlined = makeIcon("#");
export const ShareAltOutlined = makeIcon(">");
export const DownOutlined = makeIcon("v");
export const FullscreenOutlined = makeIcon("[]");
export const FullscreenExitOutlined = makeIcon("][");
export const CheckOutlined = makeIcon("ok");
export const CloseCircleOutlined = makeIcon("x");
export const CopyOutlined = makeIcon("copy");
