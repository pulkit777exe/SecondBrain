import { useRef, useState, useEffect } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { BACKEND_URL } from "../config";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { RedditIcon } from "../icons/RedditIcon";
import { GithubIcon } from "../icons/GithubIcon";
import { LinkedInIcon } from "../icons/LinkedInIcon";
import { SpotifyIcon } from "../icons/SpotifyIcon";
import { SoundCloudIcon } from "../icons/SoundCloudIcon";
import { LoomIcon } from "../icons/LoomIcon";

type ContentTypeOption = "youtube" | "twitter" | "instagram" | "reddit" | "github" | "linkedin" | "spotify" | "soundcloud" | "loom";

interface ContentData {
    contentId: string;
    title: string;
    link: string;
    type: ContentTypeOption;
    tags?: { title: string }[];
}

interface ContentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    editMode?: boolean;
    content?: ContentData | null;
}

const contentTypes: { type: ContentTypeOption; label: string; icon: string }[] = [
    { type: "youtube", label: "YouTube", icon: "youtube" },
    { type: "twitter", label: "Twitter", icon: "twitter" },
    { type: "instagram", label: "Instagram", icon: "instagram" },
    { type: "reddit", label: "Reddit", icon: "reddit" },
    { type: "github", label: "GitHub", icon: "github" },
    { type: "linkedin", label: "LinkedIn", icon: "linkedin" },
    { type: "spotify", label: "Spotify", icon: "spotify" },
    { type: "soundcloud", label: "SoundCloud", icon: "soundcloud" },
    { type: "loom", label: "Loom", icon: "loom" },
];

function getIconComponent(icon: string) {
    switch (icon) {
        case "youtube": return <YoutubeIcon />;
        case "twitter": return <TwitterIcon />;
        case "instagram": return <InstagramIcon />;
        case "reddit": return <RedditIcon />;
        case "github": return <GithubIcon />;
        case "linkedin": return <LinkedInIcon />;
        case "spotify": return <SpotifyIcon />;
        case "soundcloud": return <SoundCloudIcon />;
        case "loom": return <LoomIcon />;
        default: return <span className="text-xs">{icon[0].toUpperCase()}</span>;
    }
}

export function ContentModal({open, onClose, onSuccess, editMode, content}: ContentModalProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const tagsRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState<ContentTypeOption>("youtube");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && editMode && content) {
            setType(content.type);
            const tagStr = content.tags?.map((t: { title: string }) => t.title).join(", ") || "";
            if (titleRef.current) titleRef.current.value = content.title;
            if (linkRef.current) linkRef.current.value = content.link;
            if (tagsRef.current) tagsRef.current.value = tagStr;
        } else if (open && !editMode) {
            setType("youtube");
            if (titleRef.current) titleRef.current.value = "";
            if (linkRef.current) linkRef.current.value = "";
            if (tagsRef.current) tagsRef.current.value = "";
        }
    }, [open, editMode, content]);

    async function handleSubmit() {
        const title = titleRef.current?.value || "";
        const link = linkRef.current?.value || "";
        const tagString = tagsRef.current?.value || "";
        const tagList = tagString.split(",").map(t => t.trim()).filter(Boolean);
        
        if (!title || !link) {
            setError("Title and link are required");
            return;
        }

        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        try {
            const payload = {
                link,
                title,
                type,
                tags: tagList
            };

            const headers: Record<string, string> = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            if (editMode && content) {
                await fetch(`${BACKEND_URL}/v1/content`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify({ ...payload, contentId: content.contentId })
                });
            } else {
                await fetch(`${BACKEND_URL}/v1/content`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(payload)
                });
            }
            onClose();
            onSuccess?.();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to save");
        } finally {
            setLoading(false);
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/40" onClick={onClose} />
            <div className="relative bg-white border border-stone-200 p-8 rounded-sm max-w-md w-full">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-serif text-stone-900">
                        {editMode ? "Edit Link" : "Add Link"}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 -mr-2 text-stone-400 hover:text-stone-900 transition-colors"
                    >
                        <CrossIcon />
                    </button>
                </div>
                
                <div className="space-y-5">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Title</label>
                        <input 
                            ref={titleRef}
                            className="w-full border-b border-stone-200 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors bg-transparent" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Link</label>
                        <input 
                            ref={linkRef}
                            className="w-full border-b border-stone-200 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors bg-transparent" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Tags</label>
                        <input 
                            ref={tagsRef}
                            placeholder="tech, music"
                            className="w-full border-b border-stone-200 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors bg-transparent" 
                        />
                    </div>
                </div>
                
                <div className="mt-6">
                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-3">Type</label>
                    <div className="grid grid-cols-3 gap-2">
                        {contentTypes.map((ct) => (
                            <button
                                key={ct.type}
                                type="button"
                                onClick={() => setType(ct.type)}
                                className={`flex items-center justify-center gap-2 p-2.5 rounded-sm border transition-all duration-200 text-sm ${
                                    type === ct.type 
                                        ? "border-stone-900 bg-stone-100 text-stone-900" 
                                        : "border-stone-200 hover:border-stone-400 text-stone-500"
                                }`}
                            >
                                {getIconComponent(ct.icon)}
                                <span className="hidden sm:inline">{ct.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                {error && (
                    <p className="text-red-600 text-sm mt-4">{error}</p>
                )}
                
                <div className="flex gap-3 mt-8">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 border border-stone-200 text-stone-500 rounded-sm hover:bg-stone-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-3 bg-stone-900 text-white font-medium rounded-sm hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? "Saving..." : editMode ? "Save" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
}