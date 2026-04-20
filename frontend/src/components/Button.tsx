import { ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary" | "ghost";
    text: string;
    startIcon?: ReactElement;
    onClick?: () => void;
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
}

const variantClasses = {
    "primary": "btn-primary text-white font-medium",
    "secondary": "btn-secondary text-white",
    "ghost": "text-gray-400 hover:text-white hover:bg-white/5",
};

const defaultStyles = "px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200";


export function Button({variant, text, startIcon, onClick, fullWidth, loading, disabled, className = ""}: ButtonProps) {
    return (
        <button 
            onClick={onClick} 
            disabled={loading || disabled}
            className={`${variantClasses[variant]} ${defaultStyles} ${fullWidth ? " w-full" : ""} ${loading || disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""} ${className}`}
        >
            {startIcon && <span className="w-4 h-4">{startIcon}</span>}
            {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : text}
        </button>
    );
}