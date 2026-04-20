import { useEffect, useState, useCallback } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

export interface Content {
    _id: string;
    contentId: string;
    title: string;
    link: string;
    type: "youtube" | "twitter";
    tags: string[];
    userId: string;
}

interface UseContentReturn {
    contents: Content[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    deleteContent: (contentId: string) => Promise<void>;
}

export function useContent(): UseContentReturn {
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BACKEND_URL}/v1/content`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            setContents(response.data.allContent || []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to fetch content");
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteContent = useCallback(async (contentId: string) => {
        try {
            await axios.delete(`${BACKEND_URL}/v1/content`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                },
                data: { contentId }
            });
            setContents(prev => prev.filter(c => c.contentId !== contentId));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to delete content");
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { contents, loading, error, refresh, deleteContent };
}