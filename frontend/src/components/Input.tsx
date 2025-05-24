import React from "react";

interface InputProps { 
  placeholder: string; 
  ref?: React.RefObject<HTMLInputElement>;
}

export function Input({ placeholder, ref }: InputProps) {
  return <div>
      <input ref={ref} placeholder={placeholder} type={"text"} className="px-4 py-2 border rounded m-2" />
  </div>
}