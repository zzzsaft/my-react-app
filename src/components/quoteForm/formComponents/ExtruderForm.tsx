import React from "react";
import {
  ProForm,
  ProFormList,
  ProFormGroup,
  ProFormDigit,
  ProFormSelect,
} from "@ant-design/pro-components";
import { AutoComplete, Button, ButtonProps, InputNumber, Space } from "antd";
import {
  DragOutlined,
  CopyOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { ScrewFormItem } from "./ScrewFormItem";
import { DefaultOptionType } from "antd/es/select";
import { ExtruderFormItem } from "./ExtruderFormItem";

const ExtruderForm = ({
  items,
  count,
  creatorButtonProps = { position: "bottom" },
}: {
  items: string[];
  count?: number;
  creatorButtonProps?:
    | false
    | (ButtonProps & {
        creatorButtonText?: React.ReactNode;
        position?: "top" | "bottom";
      })
    | undefined;
}) => {
  return (
    <ProFormList
      name="extruderModel"
      label="挤出机型号"
      copyIconProps={false}
      deleteIconProps={count ? false : { Icon: CloseCircleOutlined, tooltipText: "不需要这行了" }}
      min={count}
      max={count}
      creatorButtonProps={count ? false : creatorButtonProps}
      alwaysShowItemLabel
      itemRender={({ listDom, action }, { index }) => {
        console.log(action);
        return (
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
            >
              {action}
            </div>

            {/* 表单内容 */}
            {listDom}
          </div>
        );
      }}
    >
      <ProFormGroup key="group">
        <ExtruderFormItem items={items} />
      </ProFormGroup>
    </ProFormList>
  );
};

export default ExtruderForm;
