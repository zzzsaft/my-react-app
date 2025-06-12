import { InputNumber, InputNumberProps } from "antd";
import type { IntervalValue } from "../../types/types";

export interface LevelValue {
  level: string;
  value?: IntervalValue | null;
}

export interface LevelInputNumberProps
  extends Omit<InputNumberProps, "value" | "onChange" | "addonBefore"> {
  value?: LevelValue;
  onChange?: (val: LevelValue) => void;
}

const LevelInputNumber: React.FC<LevelInputNumberProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const level = value?.level;
  const num = value?.value ? parseFloat(value.value.value) : undefined;
  const handleChange = (val: string | number | null) => {
    if (val === null) {
      onChange?.({ level: level ?? "", value: undefined });
      return;
    }
    const numeric = typeof val === "string" ? parseFloat(val) : val;
    const newVal: IntervalValue = {
      front: numeric ?? NaN,
      rear: NaN,
      value: String(val ?? ""),
      unit: rest.addonAfter ? String(rest.addonAfter) : "",
    };
    onChange?.({ level: level ?? "", value: newVal });
  };
  return (
    <InputNumber
      {...rest}
      addonBefore={level}
      value={num as any}
      onChange={handleChange}
    />
  );
};

export default LevelInputNumber;
