import { forwardRef } from "react";

interface InputProps { 
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ placeholder, type = "text", value, onChange, className = "" }, ref) => {
  return (
    <input 
      ref={ref}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input-field w-full px-4 py-2.5 rounded-lg text-sm ${className}`}
    />
  );
});