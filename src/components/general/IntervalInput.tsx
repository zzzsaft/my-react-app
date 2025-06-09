import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Input } from "antd";
import type { FormItemProps } from "antd";
import { intervalInputRules } from "../../util/rules";

export interface IntervalInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  addonAfter?: string | null;
  addonBefore?: string | null;
  /** Display unit inside the input */
  unit?: string;
  disabled?: boolean;
  /** When true, user cannot modify the value but it remains selectable */
  readOnly?: boolean;
  id?: string;
  extra?: boolean;
  decimalPlace?: number;
}

const IntervalInput: React.FC<IntervalInputProps> = forwardRef(
  (
    {
      value = "",
      onChange = () => {},
      placeholder = "请输入数值",
      disabled = false,
      readOnly = false,
      id,
      addonAfter = null,
      addonBefore = null,
      unit,
      extra = false,
      decimalPlace = 2,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<any>(null);
    const lastCursorPos = useRef(0);
    useImperativeHandle(ref, () => ({
      ...(inputRef.current || {}),
      // 可以在这里添加额外的方法
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }));
    // // 正则表达式修正
    // const rangeRegex = new RegExp(
    //   String.raw`/^(\d+(\.\d{0,2})?)(-(\d+(\.\d{0,2})?)?$/`
    // );

    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const customOnChange = (newValue: string) => {
      if (extra) {
        const e = { target: { value: newValue } };
        onChange?.(e as any);
      } else {
        onChange?.(newValue);
      }
    };

    const formatDisplayValue = (val: string) => {
      if (!isFocused && val.endsWith("-")) {
        return val.slice(0, -1);
      }
      return val;
    };
    const createPrecisionRegex = (decimalPlaces: number = 2) => {
      // 构建小数部分正则，例如 {0,2} 表示最多2位小数
      const decimalPart =
        decimalPlaces > 0 ? `(?:\\.\\d{0,${decimalPlaces}})?` : "";

      return new RegExp(
        `^(?!-)(\\d+${decimalPart})(?:-(\\d+${decimalPart})?)?$`
      );
    };

    const validateInput = (input: string): boolean => {
      if (input === "") return true;

      // 允许的格式：
      // 1. 单个数字(可带小数)：123 或 12.34
      // 2. 数字区间(可带小数)：123-456 或 12.34-56.78
      // 3. 输入中带未完成的横杠：123-
      const regex = createPrecisionRegex(decimalPlace);

      // 验证基本格式
      if (!regex.test(input)) return false;

      // 提取数字部分验证具体数值
      const parts = input.split("-").filter((part) => part !== "");

      // 验证每个数字部分 >= 0
      return parts.every((part) => {
        const num = parseFloat(part);
        return !isNaN(num) && num >= 0;
      });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      // console.log(e);
      if (input.length - internalValue.length > 1) {
        const cleaned = input.replace(/[^0-9.-]/g, "");
        if (validateInput(cleaned)) {
          setInternalValue(cleaned);
          customOnChange?.(cleaned);
        }
        return;
      }

      if (validateInput(input)) {
        setInternalValue(input);
        customOnChange?.(input);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
      if (!internalValue.includes("-")) {
        const newValue = `${internalValue}`;
        setInternalValue(newValue);

        customOnChange?.(newValue);
        setTimeout(() => {
          inputRef.current?.setSelectionRange(
            newValue.length - 1,
            newValue.length - 1
          );
        }, 0);
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      // console.log(internalValue.split("-")[1]);
      if (internalValue.includes("-") && internalValue.split("-")[1] === "") {
        const newValue = internalValue.replace("-", "");
        setInternalValue(newValue);
        customOnChange?.(newValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;
      const currentPos = inputRef.current?.selectionStart || 0;

      if (key === "-") {
        e.preventDefault();
        if (internalValue.includes("-")) {
          const dashPos = internalValue.indexOf("-");
          if (currentPos <= dashPos) {
            inputRef.current?.setSelectionRange(dashPos + 1, dashPos + 1);
          }
        } else {
          const newValue = `${internalValue.slice(
            0,
            currentPos
          )}-${internalValue.slice(currentPos)}`;
          if (validateInput(newValue)) {
            setInternalValue(newValue);
            onChange?.(newValue);
            setTimeout(() => {
              inputRef.current?.setSelectionRange(
                currentPos + 1,
                currentPos + 1
              );
            }, 0);
          }
        }
      }

      lastCursorPos.current = currentPos;
    };

    return (
      <Input
        id={id}
        ref={inputRef}
        addonBefore={addonBefore}
        value={formatDisplayValue(internalValue)}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        // onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        addonAfter={addonAfter}
        readOnly={readOnly}
        suffix={unit}
      />
    );
  }
);

// 表单包装器
interface NumberRangeInputFormItemProps extends FormItemProps {
  disabled?: boolean;
  id?: string;
  placeholder?: string;
  addonAfter?: string;
  isSecondNumberGreater?: boolean;
  unit?: string;
  readOnly?: boolean;
}

const IntervalInputFormItem: React.FC<NumberRangeInputFormItemProps> = ({
  disabled,
  id,
  placeholder,
  addonAfter,
  isSecondNumberGreater = true,
  unit,
  readOnly,
  ...formItemProps
}) => {
  return (
    <Form.Item
      {...formItemProps}
      rules={[
        ...(formItemProps.rules || []),

        isSecondNumberGreater ? intervalInputRules[0] : intervalInputRules[1],
      ]}
    >
      <IntervalInput
        disabled={disabled}
        id={id}
        placeholder={placeholder}
        addonAfter={addonAfter}
        unit={unit}
        readOnly={readOnly}
      />
    </Form.Item>
  );
};

export { IntervalInput, IntervalInputFormItem };
