import { useEffect, useState, useCallback } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

export interface Content {
    _id: string;
    contentId: string;
    title: string;
    link: string;
    type: "youtube" | "twitter" | "instagram" | "reddit" | "github" | "linkedin" | "spotify" | "soundcloud" | "loom";
    tags: { title: string }[];
    userId: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface UseContentReturn {
    contents: Content[];
    loading: boolean;
    error: string | null;
    pagination: Pagination | null;
    refresh: () => Promise<void>;
    deleteContent: (contentId: string) => Promise<void>;
    setPage: (page: number) => void;
}

export function useContent(): UseContentReturn {
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [page, setPage] = useState(1);

    const fetchContent = useCallback(async (pageNum: number = 1) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${BACKEND_URL}/v1/content?page=${pageNum}&limit=20`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setContents(response.data.allContent || []);
            setPagination(response.data.pagination || null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to fetch content");
        } finally {
            setLoading(false);
        }
    }, []);

    const refresh = useCallback(async () => {
        await fetchContent(page);
    }, [fetchContent, page]);

    const changePage = useCallback((newPage: number) => {
        setPage(newPage);
        fetchContent(newPage);
    }, [fetchContent]);

    const deleteContent = useCallback(async (contentId: string) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${BACKEND_URL}/v1/content`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                data: { contentId }
            });
            setContents(prev => prev.filter(c => c.contentId !== contentId));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to delete content");
        }
    }, []);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    return { contents, loading, error, pagination, refresh, deleteContent, setPage: changePage };
}