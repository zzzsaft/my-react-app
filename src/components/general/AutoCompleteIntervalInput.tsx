import { AutoComplete, Input } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { IntervalInput } from "./IntervalInput";
import { useEffect, useState } from "react";
import type { IntervalValue } from "../../types/types";

const DELIMITER = "～";

interface OptionTypeWithLevel extends DefaultOptionType {
  level?: string;
}

interface AutoCompleteInputProps {
  id?: string;
  value?: { value: IntervalValue | null; level: string | null };
  onChange?: (value: { value: IntervalValue | null; level: string | null }) => void;
  disabled?: boolean;
  options?: OptionTypeWithLevel[];
  addonAfter?: string | null;
  style?: React.CSSProperties;
  placeholder?: string;
  level?: string;
  addonBefore?: string | null;
}

export const AutoCompleteIntervalInput: React.FC<AutoCompleteInputProps> = ({
  value,
  id,
  onChange,
  disabled,
  options = [],
  addonAfter = null,
  style,
  placeholder,
  level,
  addonBefore = null,
}) => {
  const [levelPrefix, setLevelPrefix] = useState("定制");

  useEffect(() => {
    if (level) {
      const selectedOption = options.find((option) => option.level === level);
      const otherOption = options.find((option) => option.level);
      if (selectedOption && selectedOption.value) {
        handleChange?.(selectedOption.value);
      } else if (otherOption && otherOption.value) {
        handleChange?.(otherOption.value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);
  useEffect(() => {
    setLevelPrefix(value?.level ?? "定制");
  }, [value]);
  const toIntervalValue = (val: string | number): IntervalValue => {
    const str = String(val);
    const [frontStr, rearStr] = str.split(DELIMITER);
    return {
      front: frontStr ? parseFloat(frontStr) : NaN,
      rear: rearStr ? parseFloat(rearStr) : NaN,
      value: str,
      unit: addonAfter ?? "",
    };
  };

  const handleChange = (inputValue: IntervalValue | string | number | null) => {
    const valueStr =
      typeof inputValue === "object" && inputValue !== null
        ? inputValue.value
        : (inputValue as string | number | null);
    const selectedOption = options.find((opt) => opt.value === valueStr);

    const valObj =
      typeof inputValue === "object" && inputValue !== null
        ? (inputValue as IntervalValue)
        : inputValue !== null
        ? toIntervalValue(inputValue)
        : null;

    onChange?.({
      value: valObj,
      level: selectedOption?.level ?? null,
    });
    // } else onChange?.(inputValue);
  };
  return (
    <span id={id}>
      <AutoComplete
        options={options}
        value={value?.value?.value ?? undefined}
        onSelect={(e) => {
          // console.log(e);
          handleChange(e as any);
        }}
        style={style}
        disabled={disabled}
        // onFocus={}
      >
        <IntervalInput
          addonAfter={addonAfter}
          value={value?.value ?? undefined}
          onChange={(e: any) => handleChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          extra={true}
          addonBefore={addonBefore ?? levelPrefix}
          decimalPlace={3}
        />
      </AutoComplete>
    </span>
  );
};
