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
            <div className="min-h-screen w-full bg-stone-50 flex items-center justify-center">
                <p className="text-stone-400">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full bg-stone-50 flex items-center justify-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-stone-50 flex">
            <div className="hidden lg:flex lg:w-64 bg-stone-50 border-r border-stone-200 flex-col">
                <div className="p-8">
                    <p className="text-xs uppercase tracking-[0.15em] text-stone-400 mb-1">SecondBrain</p>
                    <h1 className="text-2xl font-serif text-stone-900">Shared</h1>
                </div>
            </div>

            <div className="flex-1 p-6 lg:p-10 overflow-auto">
                <div className="max-w-5xl mx-auto">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-2">Collection</p>
                    <h2 className="text-4xl font-serif text-stone-900 mb-10">Shared Links</h2>

                    {contents.length === 0 ? (
                        <p className="text-stone-500">No content yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {contents.map((item) => (
                                <a 
                                    key={item._id} 
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-white border border-stone-200 p-5 hover:border-stone-400 transition-all"
                                >
                                    <div className="flex gap-2 items-center mb-3">
                                        <span className={`text-xs px-2 py-1 rounded-sm ${
                                            item.type === "youtube" 
                                                ? "bg-red-100 text-red-600" 
                                                : "bg-sky-100 text-sky-600"
                                        }`}>
                                            {item.type === "youtube" ? "YouTube" : "Twitter"}
                                        </span>
                                    </div>
                                    <p className="text-stone-900 font-medium line-clamp-2">{item.title}</p>
                                    <span className="text-stone-400 text-sm mt-3 block">View →</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}