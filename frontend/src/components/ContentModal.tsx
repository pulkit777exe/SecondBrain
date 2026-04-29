import { useRef, useState, useEffect } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-zinc-950 border border-zinc-800 p-6 rounded-3xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        {editMode ? "Edit" : "Add new"}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 -mr-2 rounded-full hover:bg-zinc-900 text-zinc-500 hover:text-white transition-all"
                    >
                        <CrossIcon />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-500 mb-2">Title</label>
                        <Input ref={titleRef} placeholder="A great video" />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-500 mb-2">Link</label>
                        <Input ref={linkRef} placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-500 mb-2">Tags (comma separated)</label>
                        <Input ref={tagsRef} placeholder="tech, music" />
                    </div>
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm text-zinc-500 mb-3">Type</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setType(ContentType.Youtube)}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-200 ${
                                type === ContentType.Youtube 
                                    ? "border-red-500 bg-red-500/10 text-red-400" 
                                    : "border-zinc-800 hover:border-zinc-700 text-zinc-400"
                            }`}
                        >
                            <YoutubeIcon />
                            <span className="text-sm font-medium">YouTube</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setType(ContentType.Twitter)}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-200 ${
                                type === ContentType.Twitter 
                                    ? "border-sky-500 bg-sky-500/10 text-sky-400" 
                                    : "border-zinc-800 hover:border-zinc-700 text-zinc-400"
                            }`}
                        >
                            <TwitterIcon />
                            <span className="text-sm font-medium">Twitter</span>
                        </button>
                    </div>
                </div>
                
                {error && (
                    <p className="text-red-400 text-sm mt-4">{error}</p>
                )}
                
                <div className="flex gap-3 mt-6">
                    <Button 
                        variant="secondary" 
                        text="Cancel" 
                        onClick={onClose}
                        className="flex-1"
                    />
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-3 bg-white text-black font-medium rounded-2xl hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? "Saving..." : editMode ? "Save" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
}