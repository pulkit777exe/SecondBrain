import { Request, Response, Router } from "express";

export const OembedRouter = Router();

const oembedEndpoints: Record<string, (url: string) => string | null> = {
    twitter: (url: string) => {
        const match = url.match(/(?:twitter\.com|x\.com)\/([^\/]+)\/status\/(\d+)/);
        if (match) return `https://publish.twitter.com/oembed?url=https://twitter.com/${match[1]}/status/${match[2]}&hide_media=false`;
        return null;
    },
    reddit: (url: string) => {
        const match = url.match(/reddit\.com\/r\/([^\/]+)\/comments\/([a-z0-9]+)/i);
        if (match) return `https://www.reddit.com/oembed?url=https://www.reddit.com/r/${match[1]}/comments/${match[2]}/`;
        return null;
    },
    instagram: (url: string) => {
        const match = url.match(/instagram\.com\/p\/([a-zA-Z0-9_-]+)/);
        if (match) return `https://api.instagram.com/oembed?url=https://www.instagram.com/p/${match[1]}/`;
        return null;
    },
};

OembedRouter.get("/", async (req: Request, res: Response) => {
    const url = req.query.url as string;
    const type = req.query.type as string;

    if (!url || !type) {
        res.status(400).json({ message: "url and type are required" });
        return;
    }

    const endpointFn = oembedEndpoints[type];
    if (!endpointFn) {
        res.status(400).json({ message: `oEmbed not supported for type: ${type}` });
        return;
    }

    const oembedUrl = endpointFn(url);
    if (!oembedUrl) {
        res.status(400).json({ message: "Could not generate oEmbed URL" });
        return;
    }

    try {
        const response = await fetch(oembedUrl, {
            headers: { "User-Agent": "SecondBrain/1.0" }
        });

        if (!response.ok) {
            res.status(response.status).json({ message: "oEmbed fetch failed" });
            return;
        }

        const data = await response.json();
        const html = (data.html || "").replace(/<script[\s\S]*?<\/script>/gi, "");
        res.status(200).json({ 
            html,
            thumbnail: data.thumbnail_url || null,
            thumbnailWidth: data.thumbnail_width || null,
            thumbnailHeight: data.thumbnail_height || null
        });
    } catch (err) {
        console.error("oEmbed proxy error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
