interface QdrantPayload {
    title: string;
    contentId?: string;
    tags?: string[];
    type?: string;
    link?: string;
}

export const cleanPayload = (data: QdrantPayload): CleanedPayload => {
    const title = data.title || "";
    const contentId = data.contentId || "";
    const tagTitles = data.tags || [];

    return {
        title,
        contentId,
        tagTitles
    };
};

export type CleanedPayload = {
    title: string,
    contentId: string,
    tagTitles: string[]
} 