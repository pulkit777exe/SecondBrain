import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface SharedContent {
    _id: string;
    title: string;
    link: string;
    type: "youtube" | "twitter";
}

export default function SharedPage() {
    const { shareLink } = useParams<{ shareLink: string }>();
    const [contents, setContents] = useState<SharedContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchShared() {
            if (!shareLink) return;
            
            try {
                const response = await axios.get(`${BACKEND_URL}/v1/brain/${shareLink}`);
                setContents(response.data.content || []);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to load shared content");
            } finally {
                setLoading(false);
            }
        }
        fetchShared();
    }, [shareLink]);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-black flex items-center justify-center">
                <p className="text-zinc-500">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full bg-black flex items-center justify-center">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-black flex">
            <div className="hidden lg:flex lg:w-64 bg-zinc-900 border-r border-zinc-800 flex-col">
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-white tracking-tight">secondbrain</h1>
                </div>
            </div>

            <div className="flex-1 p-6 lg:p-10 overflow-auto">
                <div className="max-w-5xl mx-auto">
                    <p className="text-zinc-500 text-sm mb-8">shared collection</p>
                    
                    <h2 className="text-3xl font-semibold text-white mb-8">Content</h2>

                    {contents.length === 0 ? (
                        <p className="text-zinc-500">No content.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {contents.map((item) => (
                                <div key={item._id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                                    <div className="flex gap-2 items-center mb-3">
                                        <span className={`p-1.5 rounded-lg ${
                                            item.type === "youtube" 
                                                ? "bg-red-500/10 text-red-400" 
                                                : "bg-sky-500/10 text-sky-400"
                                        }`}>
                                            {item.type === "youtube" ? "YT" : "X"}
                                        </span>
                                        <span className="font-medium text-white truncate">{item.title}</span>
                                    </div>
                                    <a 
                                        href={item.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-zinc-400 hover:text-white text-sm"
                                    >
                                        View →
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}