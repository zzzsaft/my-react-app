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
      let display = val;
      if (!isFocused && display.endsWith("-")) {
        display = display.slice(0, -1);
      }
      if (!isFocused && unit) {
        display += unit;
      }
      return display;
    };

    const validateInput = (input: string): boolean => {
      if (input === "") return true;

      if (input.startsWith("-")) return false;
      if ((input.match(/-/g) || []).length > 1) return false;

      return /^\d*(?:-\d*)?$/.test(input);
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value.replace(/[^0-9-]/g, "");

      if (input.startsWith("-")) {
        input = input.slice(1);
      }

      const dashIndex = input.indexOf("-");
      if (dashIndex !== -1) {
        input =
          input.slice(0, dashIndex + 1) +
          input.slice(dashIndex + 1).replace(/-/g, "");
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
