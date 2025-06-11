import React from "react";
import { Select } from "antd";
import { selectOptions } from "../../util/valueUtil";

interface MaterialSelectProps {
  id?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  options?: Record<string, string[]>;
  disabled?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}
// 模拟数据源
const MATERIAL = {
  高剪切敏感度: ["HDPE", "LDPE", "LLDPE", "POE", "PS-GPPS"],
  中剪切敏感度: ["ABS", "PC", "PET", "PETG", "HIPS", "PP", "PLA"],
  低剪切敏感度: ["TPU", "PVC", "EVA", "TPE-SEBS", "PMMA", "PVB"],
};
const MaterialSelect: React.FC<MaterialSelectProps> = ({
  id,
  value = [],
  onChange,
  disabled = false,
  placeholder = "输入材料，按回车确认",
  style,
}) => {
  const handleChange = (newValue: string[]) => {
    if (onChange) {
      const validValue = newValue.filter((item) =>
        /^[A-Za-z0-9+-]+$/.test(item.replace(/\s/g, ""))
      );

      const upperCaseValue = validValue.map((item) =>
        item.replace(/\s/g, "").toUpperCase()
      );
      onChange(upperCaseValue);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (key.length === 1 && !/[A-Za-z0-9+-]/.test(key)) {
      e.preventDefault();
    }
  };
  return (
    <Select
      id={id}
      placeholder={placeholder}
      disabled={disabled}
      mode="tags"
      onInputKeyDown={handleInputKeyDown}
      options={selectOptions(MATERIAL)}
      value={value}
      onChange={handleChange}
      style={{ ...style, width: "100%" }}
    />
  );
};

export default MaterialSelect;
