import { TagModel } from "../db/db";
import { v4 as uuidv4 } from "uuid";

export const ProcessTags = async (tags: string[]) => {
    try {
        const tagDocs = tags.map(title => ({
            tagId: uuidv4(),
            title: title.toLowerCase().trim().replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '-').slice(0, 12)
        }));
        if (tagDocs.length > 0) {
            await TagModel.insertMany(tagDocs, { ordered: true }).catch(() => {
                console.warn("Duplicate tags are skipped");
            });
        }
    } catch (err) {
        console.error("Unexpected error during tag insertion", err);
    }
}