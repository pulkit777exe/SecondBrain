import { Request, Response, Router } from "express";

export const PreviewRouter = Router();

PreviewRouter.get("/", async (req: Request, res: Response) => {
    const url = req.query.url as string;

    if (!url) {
        res.status(400).json({ message: "url is required" });
        return;
    }

    try {
        new URL(url);
    } catch {
        res.status(400).json({ message: "Invalid URL" });
        return;
    }

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; SecondBrain/1.0)",
                "Accept": "text/html"
            },
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            res.status(200).json({ image: null, title: null, description: null });
            return;
        }

        const html = await response.text();
        
        const getMeta = (name: string): string | null => {
            const patterns = [
                new RegExp(`<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']+)["']`, "i"),
                new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${name}["']`, "i"),
                new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`, "i"),
                new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["']`, "i"),
            ];
            for (const pattern of patterns) {
                const match = html.match(pattern);
                if (match) return match[1];
            }
            return null;
        };

        const image = getMeta("og:image") || getMeta("twitter:image");
        const title = getMeta("og:title") || getMeta("twitter:title");
        const description = getMeta("og:description") || getMeta("twitter:description");

        res.status(200).json({ image, title, description });
    } catch (err) {
        console.error("Preview fetch error:", err);
        res.status(200).json({ image: null, title: null, description: null });
    }
});
