import { InputNumber, InputNumberProps } from "antd";

export interface LevelValue {
  level: string;
  value?: number | null;
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
  const num = value?.value;
  const handleChange = (val: string | number | null) => {
    const numeric =
      typeof val === "string"
        ? parseFloat(val)
        : val === null
        ? undefined
        : val;
    onChange?.({ level: level ?? "", value: numeric });
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
