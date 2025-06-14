import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Form, Input } from "antd";
import type { FormItemProps } from "antd";
import { intervalInputRules } from "@/util/rules";
import type { IntervalValue } from "@/types/types";

const DELIMITER = "~";

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
  style?: React.CSSProperties;
}

const IntervalInput1: React.FC<IntervalInputProps> = forwardRef<
  HTMLInputElement,
  IntervalInputProps
>(
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
      style,
      decimalPlace = 2,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<any>(null);
    const lastCursorPos = useRef(0);
    useImperativeHandle(ref, () => ({
      ...inputRef.current,
      focus: () => inputRef.current?.focus?.(),
      blur: () => inputRef.current?.blur?.(),
      setSelectionRange: (start: number, end: number) =>
        inputRef.current?.input?.setSelectionRange(start, end),
      get selectionStart() {
        return inputRef.current?.input?.selectionStart;
      },
      get selectionEnd() {
        return inputRef.current?.input?.selectionEnd;
      },
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
      let display = val;
      if (!isFocused && display?.endsWith(DELIMITER)) {
        display = display.slice(0, -1);
      }
      if (!isFocused && unit) {
        display += unit;
      }
      return display;
    };

    const validateInput = (input: string): boolean => {
      if (input === "") return true;

      const pattern = /^-?\d*(\.\d*)?(~-?\d*(\.\d*)?)?$/;
      if (!pattern.test(input)) return false;

      // 禁止只有后段存在（如 ~2.1）
      if (input.startsWith(DELIMITER)) return false;

      return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value.replace(/[^0-9.\-~]/g, "");

      const delimiterIndex = input.indexOf(DELIMITER);
      if (delimiterIndex !== -1) {
        input =
          input.slice(0, delimiterIndex + 1) +
          input
            .slice(delimiterIndex + 1)
            .replace(new RegExp(DELIMITER, "g"), "");
      }

      const parts = input.split(DELIMITER);
      parts[0] = parts[0].replace(/(?!^)-/g, "");
      if (parts[1] !== undefined) {
        parts[1] = parts[1].replace(/(?!^)-/g, "");
      }

      input = parts.join(DELIMITER);

      if (validateInput(input)) {
        setInternalValue(input);
        customOnChange?.(input);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
      if (!internalValue.includes(DELIMITER)) {
        const newValue = `${internalValue}`;
        setInternalValue(newValue);

        customOnChange?.(newValue);
        setTimeout(() => {
          inputRef.current?.setSelectionRange(newValue.length, newValue.length);
        }, 0);
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      // console.log(internalValue.split(DELIMITER)[1]);
      if (
        internalValue.includes(DELIMITER) &&
        internalValue.split(DELIMITER)[1] === ""
      ) {
        const newValue = internalValue.replace(DELIMITER, "");
        setInternalValue(newValue);
        customOnChange?.(newValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;
      const inputEl = inputRef.current?.input; // ✅ 获取原生 input 元素
      const currentPos = inputEl?.selectionStart ?? 0;

      const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
      ];

      if (/^[0-9.-]$/.test(key) || allowedKeys.includes(key)) {
        lastCursorPos.current = currentPos;
        return;
      } else {
        e.preventDefault();

        if (!inputEl) return;
        const beforeChar = internalValue[currentPos - 1];
        if (beforeChar === ".") {
          // 🛑 禁止插入 ~ 在小数点后
          return;
        }
        if (internalValue.includes(DELIMITER)) {
          const dashPos = internalValue.indexOf(DELIMITER);
          if (currentPos <= dashPos) {
            inputEl.setSelectionRange(dashPos + 1, dashPos + 1);
          }
          return;
        }

        const before = internalValue.slice(0, currentPos);
        const after = internalValue.slice(currentPos);
        const newValue = before + DELIMITER + after;

        if (validateInput(newValue)) {
          setInternalValue(newValue);
          customOnChange?.(newValue);

          // setTimeout(() => {
          //   inputRef.current?.input?.setSelectionRange(
          //     currentPos + 1,
          //     currentPos + 1
          //   );
          // }, 0);
        }

        return;
      }
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
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        addonAfter={addonAfter}
        readOnly={readOnly}
        style={style}
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
      <IntervalInput1
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

export { IntervalInput1, IntervalInputFormItem };
