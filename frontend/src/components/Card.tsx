import { DeleteIcon } from "../icons/DeleteIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";

interface CardProps {
    title: string,
    link: string,
    type: "youtube" | "twitter",
    contentId: string,
    onDelete?: (contentId: string) => void
}

export function Card({title, link, type, contentId, onDelete}: CardProps) {
    const getEmbedUrl = (url: string, contentType: string) => {
        if (contentType === "youtube") {
            const videoId = url.split("v=")[1]?.split("&")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    };

    return (
        <div className="card-elevated rounded-xl p-4 w-full max-w-md animate-fade-in hover:border-purple-500/30 transition-colors group">
            <div className="flex justify-between items-center mb-3">
                <div className="flex gap-2 items-center">
                    <span className={`p-1.5 rounded-lg ${type === "youtube" ? "bg-red-500/10 text-red-400" : "bg-sky-500/10 text-sky-400"}`}>
                        {type === "youtube" ? <YoutubeIcon /> : <TwitterIcon />}
                    </span>
                    <span className="font-medium text-white truncate max-w-[180px]">{title}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-purple-400" title="Share">
                        <ShareIcon />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-red-400" onClick={() => onDelete?.(contentId)} title="Delete">
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
                       className="block p-4 text-sm text-purple-400 hover:text-purple-300 hover:underline">
                        View on Twitter →
                    </a>
                )}
            </div>
        </div>
    );
}