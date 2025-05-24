import { z } from "zod";
import  { contentTypes } from "../db/db";

const TagSchema = z.object({
    tagId: z.string(),
    title: z
    .string()
    .toLowerCase()
    .trim()
    .max(12, {message: "Max length of 12 is allowed"})
    .transform((v) => v.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '-'))
})

export const AuthSchema = z.object({
    email: z.string().email().min(8, {message: "Enter a valid email"}).max(25, {message: "No a valid email"}),
    password: z.string().min(8, {message: "Min length should be 8 characters"}).max(20, {message: "Maximum length of 20 is allowed"})
})

export const ContentSchema = z.object({
    link: z.string().min(1, {message: "Enter a valid link"}),
    type: z.enum(contentTypes, {message: "Enter a valid type"}),
    title: z.string().min(1, {message: "Enter a title"}),
    tags: z.array(TagSchema),
    contentId: z.string()
})


export type ContentType = z.infer<typeof ContentSchema>
export type TagType = z.infer<typeof TagSchema>