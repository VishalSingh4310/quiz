import React, { FC, InputHTMLAttributes } from 'react';
interface CustomInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  customClassName?: string;
}
const CustomInputField: FC<CustomInputFieldProps> = ({ customClassName, ...props }) => {
  return (
    <input {...props} className={`${customClassName} rounded p-2 text-sm bg-[#494949]`} />
  );
};

export default CustomInputField;
