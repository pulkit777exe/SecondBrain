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
        <div className="group bg-zinc-950/50 backdrop-blur-sm rounded-3xl p-3 border border-zinc-900/50 hover:border-zinc-800 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20">
            <div className="relative">
                {type === "youtube" && (
                    <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                        <iframe 
                            src={getEmbedUrl(link, "youtube")} 
                            className="w-full h-full object-cover"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}

                {type === "twitter" && (
                    <a 
                        href={link.replace("x.com", "twitter.com")} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                <TwitterIcon />
                            </div>
                            <span className="text-sm text-zinc-400">View on Twitter</span>
                        </div>
                        <p className="text-white font-medium line-clamp-2">{title}</p>
                    </a>
                )}

                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button 
                        className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-black/80 transition-all"
                        title="Share"
                    >
                        <ShareIcon />
                    </button>
                    <button 
                        className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white/80 hover:text-white hover:bg-black/80 transition-all"
                        onClick={() => onEdit?.(contentId)}
                        title="Edit"
                    >
                        <EditIcon />
                    </button>
                    <button 
                        className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white/80 hover:text-red-400 hover:bg-red-400/20 transition-all"
                        onClick={() => onDelete?.(contentId)}
                        title="Delete"
                    >
                        <DeleteIcon />
                    </button>
                </div>
            </div>

            <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${type === "youtube" ? "bg-red-500/10" : "bg-sky-500/10"}`}>
                        {type === "youtube" ? <YoutubeIcon /> : <TwitterIcon />}
                    </div>
                    <span className="text-white font-medium text-sm truncate">{title}</span>
                </div>

                {tags && tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                        {tags.slice(0, 4).map((tag, i) => (
                            <span 
                                key={i} 
                                className="text-xs px-2 py-1 bg-zinc-900/80 text-zinc-500 rounded-full hover:text-zinc-300 transition-colors cursor-default"
                            >
                                #{tag.title}
                            </span>
                        ))}
                        {tags.length > 4 && (
                            <span className="text-xs text-zinc-600">+{tags.length - 4}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}