import { useRef, useState, useEffect } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter"
}

interface ContentData {
    contentId: string;
    title: string;
    link: string;
    type: "youtube" | "twitter";
    tags?: { title: string }[];
}

interface ContentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    editMode?: boolean;
    content?: ContentData | null;
}

export function ContentModal({open, onClose, onSuccess, editMode, content}: ContentModalProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const tagsRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState<ContentType>(ContentType.Youtube);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && editMode && content) {
            setType(content.type as ContentType);
            const tagStr = content.tags?.map((t: { title: string }) => t.title).join(", ") || "";
            if (titleRef.current) titleRef.current.value = content.title;
            if (linkRef.current) linkRef.current.value = content.link;
            if (tagsRef.current) tagsRef.current.value = tagStr;
        } else if (open && !editMode) {
            setType(ContentType.Youtube);
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

        try {
            if (editMode && content) {
                await axios.put(`${BACKEND_URL}/v1/content`, {
                    contentId: content.contentId,
                    link,
                    title,
                    type,
                    tags: tagList
                }, {
                    headers: { "Authorization": localStorage.getItem("token") }
                });
            } else {
                await axios.post(`${BACKEND_URL}/v1/content`, {
                    link,
                    title,
                    type,
                    tags: tagList
                }, {
                    headers: { "Authorization": localStorage.getItem("token") }
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
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setType(ContentType.Youtube)}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-sm border transition-all duration-200 ${
                                type === ContentType.Youtube 
                                    ? "border-red-400 bg-red-50 text-red-600" 
                                    : "border-stone-200 hover:border-stone-400 text-stone-500"
                            }`}
                        >
                            <YoutubeIcon />
                            <span className="text-sm font-medium">YouTube</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setType(ContentType.Twitter)}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-sm border transition-all duration-200 ${
                                type === ContentType.Twitter 
                                    ? "border-sky-400 bg-sky-50 text-sky-600" 
                                    : "border-stone-200 hover:border-stone-400 text-stone-500"
                            }`}
                        >
                            <TwitterIcon />
                            <span className="text-sm font-medium">Twitter</span>
                        </button>
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