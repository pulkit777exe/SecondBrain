import { forwardRef, useState } from "react";
import { EyeIcon } from "../icons/EyeIcon";
import { EyeOffIcon } from "../icons/EyeOffIcon";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ placeholder, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className="relative">
                <input
                    ref={ref}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    className="w-full border-b border-stone-200 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors bg-transparent pr-10"
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    tabIndex={-1}
                >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";