import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";

export function SideBar() {
    return (
        <div className="h-screen bg-black border-r border-[#2a2a2a] w-72 fixed left-0 top-0 flex flex-col">
            <div className="flex items-center gap-3 pt-8 px-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                    <Logo />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">SecondBrain</h1>
                    <p className="text-xs text-gray-500">Your digital memory</p>
                </div>
            </div>
            
            <div className="mt-8 px-4">
                <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Categories</p>
                <SidebarItem text="All Content" icon={<TwitterIcon />} />
                <SidebarItem text="Twitter" icon={<TwitterIcon />} />
                <SidebarItem text="YouTube" icon={<YoutubeIcon />} />
            </div>
            
            <div className="mt-auto p-4 border-t border-[#2a2a2a]">
                <div className="glass rounded-xl p-4">
                    <p className="text-sm text-gray-400">Upgrade to Pro</p>
                    <p className="text-xs text-gray-500 mt-1">Unlock unlimited storage</p>
                </div>
            </div>
        </div>
    );
}