import React from "react";

interface NumberInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength: number;
  id: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, maxLength, id }) => {
  return (
    <input
      id={id}
      type="text"
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      className="field custom-input w-12 text-center"
    />
  );
};

export default NumberInput;
