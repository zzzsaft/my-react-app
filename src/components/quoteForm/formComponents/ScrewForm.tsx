import React from "react";
import {
  ProForm,
  ProFormList,
  ProFormGroup,
  ProFormDigit,
  ProFormSelect,
} from "@ant-design/pro-components";
import { AutoComplete, InputNumber, Space } from "antd";
import {
  DragOutlined,
  CopyOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { ScrewFormItem } from "./ScrewFormItem";
import { DefaultOptionType } from "antd/es/select";

const ScrewForm = ({
  items,
  creatorButtonProps = false,
}: {
  items: string[];
  creatorButtonProps?: false | undefined;
}) => {
  return (
    <ProFormList
      name="screwList"
      label="螺杆明细"
      copyIconProps={{ Icon: CopyOutlined, tooltipText: "复制此项到末尾" }}
      deleteIconProps={{
        Icon: CloseCircleOutlined,
        tooltipText: "不需要这行了",
      }}
      creatorButtonProps={creatorButtonProps}
      alwaysShowItemLabel
      itemRender={({ listDom, action }) => (
        <div
          style={{
            position: "relative",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
            padding: "8px",
            marginBottom: "8px",
            // backgroundColor: "#fafafa",
          }}
        >
          {/* 操作按钮 - 右上角 */}
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              zIndex: 1,
            }}
          ></div>

          {/* 表单内容 */}
          {listDom}
        </div>
      )}
    >
      <ProFormGroup key="group">
        <ScrewFormItem items={items} />
      </ProFormGroup>
    </ProFormList>
  );
};

export default ScrewForm;
