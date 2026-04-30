import { useRef, useState } from "react";
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

interface CreateContentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function CreateContentModal({open, onClose, onSuccess}: CreateContentModalProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState<ContentType>(ContentType.Youtube);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function addContent() {
        const title = titleRef.current?.value || "";
        const link = linkRef.current?.value || "";
        
        if (!title || !link) {
            setError("Title and link are required");
            return;
        }

        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        try {
            await axios.post(`${BACKEND_URL}/v1/content`, {
                link,
                title,
                type
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (titleRef.current) titleRef.current.value = "";
            if (linkRef.current) linkRef.current.value = "";
            onClose();
            onSuccess?.();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to add content");
        } finally {
            setLoading(false);
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-zinc-900 p-6 rounded-2xl border border-zinc-800 max-w-md w-full mx-4 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Add New Content</h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                    >
                        <CrossIcon />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Title</label>
                        <Input ref={titleRef} placeholder="Enter a title for your content" />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">Link</label>
                        <Input ref={linkRef} placeholder="Paste URL here" />
                    </div>
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm text-zinc-400 mb-3">Content Type</label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setType(ContentType.Youtube)}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                                type === ContentType.Youtube 
                                    ? "border-red-500 bg-red-500/10 text-red-400" 
                                    : "border-[#2a2a2a] hover:border-[#3a3a3a] text-zinc-400"
                            }`}
                        >
                            <YoutubeIcon />
                            YouTube
                        </button>
                        <button
                            onClick={() => setType(ContentType.Twitter)}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                                type === ContentType.Twitter 
                                    ? "border-sky-500 bg-sky-500/10 text-sky-400" 
                                    : "border-[#2a2a2a] hover:border-[#3a3a3a] text-zinc-400"
                            }`}
                        >
                            <TwitterIcon />
                            Twitter
                        </button>
                    </div>
                </div>
                
                {error && (
                    <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}
                
                <div className="flex gap-3 mt-6">
                    <Button 
                        variant="secondary" 
                        text="Cancel" 
                        onClick={onClose}
                        className="flex-1"
                    />
                    <Button 
                        onClick={addContent} 
                        variant="primary" 
                        text={loading ? "Adding..." : "Add Content"} 
                        disabled={loading}
                        className="flex-1"
                    />
                </div>
            </div>
        </div>
    );
}