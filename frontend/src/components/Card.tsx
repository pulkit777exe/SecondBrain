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
        <div className="group bg-white rounded-sm border border-stone-200 p-4 hover:border-stone-400 transition-all duration-300">
            <div className="relative">
                {type === "youtube" && (
                    <div className="aspect-video rounded-sm overflow-hidden bg-stone-100">
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
                        className="block p-6 bg-stone-50 rounded-sm border border-stone-200 hover:border-stone-400 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                                <TwitterIcon />
                            </div>
                            <span className="text-sm text-stone-500">View on Twitter</span>
                        </div>
                        <p className="text-stone-900 font-medium line-clamp-2">{title}</p>
                    </a>
                )}

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button 
                        className="p-2 bg-white border border-stone-200 rounded-sm text-stone-500 hover:text-stone-900 hover:border-stone-400 transition-all"
                        title="Share"
                    >
                        <ShareIcon />
                    </button>
                    <button 
                        className="p-2 bg-white border border-stone-200 rounded-sm text-stone-500 hover:text-stone-900 hover:border-stone-400 transition-all"
                        onClick={() => onEdit?.(contentId)}
                        title="Edit"
                    >
                        <EditIcon />
                    </button>
                    <button 
                        className="p-2 bg-white border border-stone-200 rounded-sm text-stone-500 hover:text-red-600 hover:border-red-200 transition-all"
                        onClick={() => onDelete?.(contentId)}
                        title="Delete"
                    >
                        <DeleteIcon />
                    </button>
                </div>
            </div>

            <div className="pt-3">
                <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1 rounded-sm ${type === "youtube" ? "bg-red-100" : "bg-sky-100"}`}>
                        {type === "youtube" ? <YoutubeIcon /> : <TwitterIcon />}
                    </div>
                    <span className="text-stone-900 font-medium text-sm truncate">{title}</span>
                </div>

                {tags && tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                        {tags.slice(0, 4).map((tag, i) => (
                            <span 
                                key={i} 
                                className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-sm hover:bg-stone-200 transition-colors cursor-default"
                            >
                                #{tag.title}
                            </span>
                        ))}
                        {tags.length > 4 && (
                            <span className="text-xs text-stone-400">+{tags.length - 4}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}