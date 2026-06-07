interface QdrantPayload {
    title: string;
    contentId?: string;
    tags?: string[];
    type?: string;
    link?: string;
    userId?: string;
}

export const cleanPayload = (data: QdrantPayload): CleanedPayload => {
    const title = data.title || "";
    const contentId = data.contentId || "";
    const tagTitles = data.tags || [];
    const userId = data.userId || "";

    return {
        title,
        contentId,
        tagTitles,
        userId
    };
};

export type CleanedPayload = {
    title: string,
    contentId: string,
    tagTitles: string[],
    userId: string
} 