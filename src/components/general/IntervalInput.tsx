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
import type { IntervalValue } from "../../types/types";

const DELIMITER = "～";

export interface IntervalInputProps {
  value?: IntervalValue;
  onChange?: (value: IntervalValue) => void;
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
      value,
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
    const [internalValue, setInternalValue] = useState(value?.value ?? "");
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
      setInternalValue(value?.value ?? "");
    }, [value]);

    const constructValue = (val: string): IntervalValue => {
      const [frontStr, rearStr] = val.split(DELIMITER);
      return {
        front: frontStr ? parseFloat(frontStr) : NaN,
        rear: rearStr ? parseFloat(rearStr) : NaN,
        value: val,
        unit: unit ?? "",
      };
    };

    const customOnChange = (newValue: string) => {
      const v = constructValue(newValue);
      if (extra) {
        const e = { target: { value: v } };
        onChange?.(e as any);
      } else {
        onChange?.(v);
      }
    };

    const formatDisplayValue = (val: string) => {
      let display = val;
      if (!isFocused && display.endsWith(DELIMITER)) {
        display = display.slice(0, -1);
      }
      if (!isFocused && unit) {
        display += unit;
      }
      return display;
    };

    const validateInput = (input: string): boolean => {
      if (input === "") return true;

      return /^-?\d*(?:～-?\d*)?$/.test(input);
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value.replace(/[^0-9-～]/g, "");

      const delimiterIndex = input.indexOf(DELIMITER);
      if (delimiterIndex !== -1) {
        input =
          input.slice(0, delimiterIndex + 1) +
          input.slice(delimiterIndex + 1).replace(new RegExp(DELIMITER, "g"), "");
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
          inputRef.current?.setSelectionRange(
            newValue.length - 1,
            newValue.length - 1
          );
        }, 0);
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      // console.log(internalValue.split(DELIMITER)[1]);
      if (internalValue.includes(DELIMITER) && internalValue.split(DELIMITER)[1] === "") {
        const newValue = internalValue.replace(DELIMITER, "");
        setInternalValue(newValue);
        customOnChange?.(newValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;
      const currentPos = inputRef.current?.selectionStart || 0;

      if (key === DELIMITER) {
        e.preventDefault();
        if (internalValue.includes(DELIMITER)) {
          const dashPos = internalValue.indexOf(DELIMITER);
          if (currentPos <= dashPos) {
            inputRef.current?.setSelectionRange(dashPos + 1, dashPos + 1);
          }
        } else {
          const newValue = `${internalValue.slice(
            0,
            currentPos
          )}${DELIMITER}${internalValue.slice(currentPos)}`;
          if (validateInput(newValue)) {
            setInternalValue(newValue);
            customOnChange?.(newValue);
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
