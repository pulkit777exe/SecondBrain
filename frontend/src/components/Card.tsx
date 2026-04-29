import { DeleteIcon } from "../icons/DeleteIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { EditIcon } from "../icons/EditIcon";

interface CardProps {
    title: string,
    link: string,
    type: "youtube" | "twitter",
    contentId: string,
    tags?: { title: string }[];
    onDelete?: (contentId: string) => void
    onEdit?: (contentId: string) => void
}

export function Card({title, link, type, contentId, tags, onDelete, onEdit}: CardProps) {
    const getEmbedUrl = (url: string, contentType: string) => {
        if (contentType === "youtube") {
            const videoId = url.split("v=")[1]?.split("&")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    };

    return (
        <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 hover:border-zinc-700 transition-colors group">
            <div className="flex justify-between items-center mb-3">
                <div className="flex gap-2 items-center">
                    <span className={`p-1.5 rounded-lg ${type === "youtube" ? "bg-red-500/10 text-red-400" : "bg-sky-500/10 text-sky-400"}`}>
                        {type === "youtube" ? <YoutubeIcon /> : <TwitterIcon />}
                    </span>
                    <span className="font-medium text-white truncate max-w-[180px]">{title}</span>
                </div>
                {tags && tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-2">
                        {tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">{tag.title}</span>
                        ))}
                        {tags.length > 3 && <span className="text-xs text-zinc-500">+{tags.length - 3}</span>}
                    </div>
                )}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white" title="Share">
                        <ShareIcon />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white" onClick={() => onEdit?.(contentId)} title="Edit">
                        <EditIcon />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-red-400" onClick={() => onDelete?.(contentId)} title="Delete">
                        <DeleteIcon />
                    </button>
                </div>
            </div>
            <div className="w-full rounded-lg overflow-hidden bg-black/50">
                {type === "youtube" && (
                    <iframe 
                        src={getEmbedUrl(link, "youtube")} 
                        className="w-full aspect-video rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}

                {type === "twitter" && (
                    <a href={link.replace("x.com", "twitter.com")} target="_blank" rel="noopener noreferrer" 
                       className="block p-4 text-sm text-zinc-400 hover:text-white transition-colors">
                        View on Twitter →
                    </a>
                )}
            </div>
        </div>
    );
}