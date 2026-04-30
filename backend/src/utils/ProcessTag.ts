import { TagModel } from "../db/db";
import { randomUUID } from "crypto";

export const ProcessTags = async (tags: string[]) => {
    try {
        const tagDocs = tags.map(title => ({
            tagId: randomUUID(),
            title: title.toLowerCase().trim().replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '-').slice(0, 12)
        }));
        if (tagDocs.length > 0) {
            await TagModel.insertMany(tagDocs, { ordered: true }).catch(() => {
                console.warn("Duplicate tags are skipped");
            });
        }
        return tagDocs;
    } catch (err) {
        console.error("Unexpected error during tag insertion", err);
        return [];
    }
}