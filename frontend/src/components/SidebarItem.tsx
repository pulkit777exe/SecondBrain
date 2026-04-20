import { ReactElement } from "react";

interface SidebarItemProps {
    text: string;
    icon?: ReactElement;
    active?: boolean;
}

export function SidebarItem({text, icon, active}: SidebarItemProps) {
    return (
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group ${
            active 
                ? "bg-purple-600/20 text-purple-400" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}>
            {icon && <span className="w-4 h-4">{icon}</span>}
            <span className="text-sm">{text}</span>
        </div>
    );
}