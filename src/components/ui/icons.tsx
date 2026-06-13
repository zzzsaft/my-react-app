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

const SearchIcon = ({ className, style, ...props }: IconProps) => (
  <span
    aria-hidden="true"
    className={className}
    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", ...style }}
    {...props}
  >
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  </span>
);

const EditIcon = ({ className, style, ...props }: IconProps) => (
  <span
    aria-hidden="true"
    className={className}
    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", ...style }}
    {...props}
  >
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  </span>
);

export const MenuFoldOutlined = makeIcon("=");
export const MenuUnfoldOutlined = makeIcon("=");
export const UserOutlined = makeIcon("U");
export const HomeOutlined = makeIcon("H");
export const SettingOutlined = makeIcon("*");
export const LogoutOutlined = makeIcon("<");
export const SearchOutlined = SearchIcon;
export const PlusOutlined = makeIcon("+");
export const DeleteOutlined = makeIcon("x");
export const EditOutlined = EditIcon;
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
