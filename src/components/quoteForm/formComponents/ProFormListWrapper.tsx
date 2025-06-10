import React from "react";
import { ProFormList, ProFormGroup } from "@ant-design/pro-components";
import { CloseCircleOutlined, CopyOutlined } from "@ant-design/icons";
import type { ButtonProps } from "antd";

interface ProFormListWrapperProps {
  name: string;
  label: React.ReactNode;
  count?: number;
  canCreate?: boolean;
  canDelete?: boolean;
  copyable?: boolean;
  rules?: any[];
  creatorButtonProps?:
    | (ButtonProps & {
        creatorButtonText?: React.ReactNode;
        position?: "top" | "bottom";
      })
    | undefined;
  formItems: React.ReactNode;
}

const ProFormListWrapper: React.FC<ProFormListWrapperProps> = ({
  name,
  label,
  count,
  canCreate = true,
  canDelete = true,
  copyable = false,
  creatorButtonProps,
  rules,
  formItems,
}) => {
  return (
    <ProFormList
      name={name}
      label={label}
      rules={rules}
      min={count}
      max={count}
      copyIconProps={
        copyable
          ? {
              Icon: CopyOutlined,
              tooltipText: "\u590d\u5236\u6b64\u9879\u5230\u672b\u5c3e",
            }
          : false
      }
      deleteIconProps={
        canDelete
          ? {
              Icon: CloseCircleOutlined,
              tooltipText: "\u4e0d\u9700\u8981\u8fd9\u884c\u4e86",
            }
          : false
      }
      creatorButtonProps={canCreate ? creatorButtonProps : false}
      alwaysShowItemLabel
      itemRender={({ listDom, action }) => (
        <div
          style={{
            position: "relative",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "8px",
            marginBottom: "8px",
          }}
        >
          <div style={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
            {action}
          </div>
          {listDom}
        </div>
      )}
    >
      <ProFormGroup key="group">{formItems}</ProFormGroup>
    </ProFormList>
  );
};

export default ProFormListWrapper;
