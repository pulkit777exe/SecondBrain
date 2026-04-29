import { Request, Response, Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { ContentSchema, CreateContentSchema } from "../types/Schemas";
import { ProcessTags } from "../utils/ProcessTag";
import { QdrantDelete, QdrantSearch, QdrantUpsertPoints } from "../utils/QdrantProcessing";
import { ContentModel } from "../db/db";
import { getEmbeddings } from "../utils/TextEmbedding";
import { v4 as uuidv4 } from "uuid";

export const ContentRouter = Router();

function generateContentId(): string {
    return uuidv4();
}

ContentRouter.post("/", authMiddleware, async (req: Request, res: Response) => {
    try {
        const {success, data, error} = CreateContentSchema.safeParse(req.body);
        if (!success) {
            res.status(411).json({
                message: "Error in inputs",
                error: error.errors
            })
            return;
        }

        const contentId = generateContentId();
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const tags = data.tags || [];
        await ProcessTags(tags);
        await QdrantUpsertPoints({ title: data.title, contentId, tags });

        await ContentModel.create({
            contentId,
            link: data.link,
            type: data.type,
            title: data.title,
            tags,
            userId
        });
        res.status(200).json({
            content: {
                link: data.link,
                type: data.type,
                title: data.title,
                tags,
                contentId
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            error: err,
        });
    }
})

ContentRouter.get("/", authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const [allContent, total] = await Promise.all([
            ContentModel.find({ userId })
                .populate("userId", "username")
                .populate("tags", "title")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            ContentModel.countDocuments({ userId })
        ]);

        res.status(200).json({
            allContent,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }); 
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err,
        });
    }
})

ContentRouter.delete('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const contentId = req.body.contentId;
        const userId = req.userId;

        if (!contentId) {
            res.status(400).json({
                message: "Content ID is required for deletion",
            });
            return;
        }

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        await ContentModel.deleteOne({ contentId, userId });
        await QdrantDelete(contentId);
        res.status(200).json({
            message: "Deleted",
        });
    } catch (e) {
        res.status(500).json({
            message: "Internal Server Error",
            error: e,
        });
    }
});

ContentRouter.put('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { success, data, error } = CreateContentSchema.safeParse(req.body);

        if (!success) {
            res.status(411).json({
                message: "Error in inputs",
                errors: error.errors,
            });
            return;
        }

        const contentId = req.body.contentId;
        const userId = req.userId;

        if (!contentId) {
            res.status(400).json({
                message: "Content ID is required for updates",
            });
            return;
        }

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const updatedContent = await ContentModel.findOneAndUpdate(
            { contentId, userId },
            {
                link: data.link,
                type: data.type,
                title: data.title,
                tags: data.tags || [],
            },
            { new: true }
        );

        if (!updatedContent) {
            res.status(404).json({
                message: "Content not found or you're not authorized to update it",
            });
            return;
        }

        await QdrantUpsertPoints({ title: data.title, contentId, tags: data.tags })
        res.status(200).json({
            message: "Content updated successfully",
            updatedContent,
        });
    } catch (e) {
        console.error("Error updating content:", e);
        res.status(500).json({
            message: "Internal Server Error",
            error: e,
        });
    }
});

ContentRouter.post('/search', authMiddleware, async(req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const searchQuery = req.body.search;
    if (!searchQuery) {
        res.status(400).json({ message: "Search query required" });
        return;
    }

    const queryEmbeddings = await getEmbeddings(searchQuery);
    const response = await QdrantSearch(queryEmbeddings);
    res.status(200).json({
        search: response
    });
});
