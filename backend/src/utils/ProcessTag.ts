import { randomUUID } from "crypto";

export const ProcessTags = (tags: string[]) => {
    return tags.map(title => ({
        tagId: randomUUID(),
        title: title.toLowerCase().trim().replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '-').slice(0, 12)
    }));
}