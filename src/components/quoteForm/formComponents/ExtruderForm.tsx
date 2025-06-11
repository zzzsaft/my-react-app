import React from "react";
import type { ButtonProps } from "antd";
import { ExtruderFormItem } from "./ExtruderFormItem";
import ProFormListWrapper from "./ProFormListWrapper";

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
    <ProFormListWrapper
      name="extruderModel"
      label="挤出机型号"
      min={count}
      max={count}
      canCreate={!count}
      canDelete={!count}
      formItems={<ExtruderFormItem items={items} />}
    />
  );
};

export default ExtruderForm;
