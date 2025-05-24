import { ContentType } from "../types/Schemas";

export type CleanedPayload = {
    title: string,
    contentId: string,
    tagTitles: string[]
}

export const cleanPayload = (data: ContentType): CleanedPayload => {
    const  {title, tags, contentId} = data;
    const tagTitles = tags.map(tag => tag.title);

    return {
        title, 
        contentId,
        tagTitles
    }
} 