import React from "react";
import {
  ProFormList,
  ProFormGroup,
  ProFormListProps,
} from "@ant-design/pro-components";
import { CloseCircleOutlined, CopyOutlined } from "@ant-design/icons";
import type { ButtonProps } from "antd";
import { ProFromListCommonProps } from "@ant-design/pro-form/es/components/List/ListItem";

interface ProFormListWrapperProps extends ProFromListCommonProps {
  name: string;
  label: React.ReactNode;
  canCreate?: boolean;
  canDelete?: boolean;
  copyable?: boolean;
  rules?: any[];
  formItems: React.ReactNode;
  isHorizontal?: boolean;
  initialValue?: any;
  creatorRecord?: any;
}

const ProFormListWrapper: React.FC<ProFormListWrapperProps> = ({
  name,
  label,
  min,
  max,
  canCreate = true,
  canDelete = true,
  copyable = false,
  creatorButtonProps,
  rules,
  formItems,
  isHorizontal = false,
  initialValue,
  creatorRecord,
}) => {
  return (
    <ProFormList
      initialValue={initialValue}
      creatorRecord={creatorRecord}
      name={name}
      label={label}
      rules={rules}
      min={min}
      max={max}
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
              tooltipText: "不需要这行了",
            }
          : false
      }
      creatorButtonProps={canCreate ? creatorButtonProps : false}
      alwaysShowItemLabel
      itemRender={({ listDom, action }) =>
        isHorizontal ? (
          <>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginInlineEnd: 25,
              }}
            >
              {listDom}
              {action}
            </div>
          </>
        ) : (
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
        )
      }
    >
      <ProFormGroup key="group">{formItems}</ProFormGroup>
    </ProFormList>
  );
};

export default ProFormListWrapper;
