import { TagModel } from "../db/db";
import { TagType } from "../types/Schemas";

export const ProcessTags = async (tags: TagType[]) => {
    try {
        await TagModel.insertMany(tags, {ordered: true})
    } catch (err) {
        //@ts-ignore
        if (err.code === 11000) {
            console.warn("Duplicate tags are skipped");
        }
        else {
            console.error("Unexpected error during tag insertion", err);
        }
    }
}