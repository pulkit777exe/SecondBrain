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
      className={`w-full px-4 py-2.5 rounded-md text-sm bg-white border border-[#e7e5e4] text-[#1c1917] placeholder:text-[#a8a29e] transition-all duration-200 focus:border-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#1c1917]/30 ${className}`}
    />
  );
});