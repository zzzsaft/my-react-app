import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { AutoCompleteProps, InputRef } from "antd";
import { AutoComplete, Flex, Input, Tag, theme } from "antd";
import { TweenOneGroup } from "rc-tween-one";
import { SelectProps } from "antd/lib";
import { selectOptions } from "@/util/valueUtil";

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
  placeholder = "输入标签，按回车确认",
  style,
}) => {
  const { token } = theme.useToken();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<AutoCompleteProps["options"]>();
  const inputRef = useRef<any>(null);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);
  const handleClose = (removedTag: string) => {
    if (disabled) return;
    onChange?.(value.filter((tag) => tag !== removedTag));
  };

  const showInput = () => {
    if (disabled) return;
    setInputVisible(true);
    setOptions(selectOptions(MATERIAL));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // 如果输入框有内容，按输入筛选
    if (val) {
      const filteredOptions = selectOptions(
        Object.fromEntries(
          Object.entries(MATERIAL).map(([groupName, items]) => [
            groupName,
            items.filter(
              (item) =>
                item.toLowerCase().includes(val.toLowerCase()) && // 匹配输入
                !value.includes(item) // 排除已选
            ),
          ])
        )
      );
      setOptions(filteredOptions);
    } else {
      // 如果输入框为空，显示所有选项（排除已选）
      setOptions(selectOptions(MATERIAL));
    }
  };

  const addTag = (tag: string) => {
    if (!value) {
      onChange?.([tag.toUpperCase()]);
    } else if (tag && !value?.includes(tag)) {
      onChange?.([...value, tag.toUpperCase()]);
    }
    setInputVisible(false);
    setInputValue("");
    setOptions([]);
  };

  const tagChild = value?.map((tag) => (
    <span key={tag} style={{ display: "inline-block" }}>
      <Tag
        closable={!disabled}
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    </span>
  ));

  const containerStyle: React.CSSProperties = {
    ...style,
    width: "100%",
    border: `1px solid ${token.colorBorder}`,
    borderRadius: token.borderRadius,
    padding: "4px 11px",
    minHeight: "32px",
    backgroundColor: disabled
      ? token.colorBgContainerDisabled
      : token.colorBgContainer,
    display: "flex", // 新增
    flexDirection: "column", // 新增
    gap: "8px", // 新增子元素间距
  };

  return (
    <div style={containerStyle} id={id}>
      <Flex
        gap="4px 0px"
        wrap
        style={{
          marginTop: 4,
          marginBottom: 4, // 从8px减小到4px
          display: "flex",
          // flexWrap: "wrap", // 允许标签换行
          gap: "14px 18px", // 标签间水平8px/垂直4px间距
          alignItems: "center", // 垂直居中
        }}
      >
        <TweenOneGroup
          appear={false}
          enter={{ scale: 0.8, opacity: 0, type: "from", duration: 100 }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          onEnd={(e) => {
            if (e.type === "appear" || e.type === "enter") {
              (e.target as any).style = "display: inline-block";
            }
          }}
        >
          {tagChild}
        </TweenOneGroup>
        {inputVisible ? (
          <AutoComplete
            ref={inputRef}
            options={options}
            style={{ width: "100%" }}
            onSelect={addTag}
          >
            <Input
              // ref={inputRef}
              size="small"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={() => addTag(inputValue)}
              onPressEnter={() => addTag(inputValue)}
              placeholder={placeholder}
              disabled={disabled}
            />
          </AutoComplete>
        ) : (
          !disabled && (
            <Tag
              onClick={showInput}
              style={{
                background: token.colorBgContainer,
                borderStyle: "dashed",
                cursor: "pointer",
              }}
            >
              <PlusOutlined /> 添加原料
            </Tag>
          )
        )}
      </Flex>
    </div>
  );
};

export default MaterialSelect;
