import { DeleteIcon } from "../icons/DeleteIcon";
import { NotebookIcon } from "../icons/NotebookIcon";
import { ShareIcon } from "../icons/ShareIcon";

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
            return url.replace("watch?v=", "embed/");
        }
        return url;
    };

    return <div className="bg-white rounded-xl border border-gray-200 p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2 items-center">
                <span className="text-gray-500">
                    <NotebookIcon />
                </span>
                <span className="font-medium truncate max-w-[200px]">{title}</span>
            </div>
            <div className="flex gap-2 text-gray-400">
                <button className="hover:text-purple-500" title="Share">
                    <ShareIcon />
                </button>
                <button className="hover:text-red-500" onClick={() => onDelete?.(contentId)} title="Delete">
                    <DeleteIcon />
                </button>
            </div>
        </div>
        <div className="w-full">
            {type === "youtube" && (
                <iframe 
                    src={getEmbedUrl(link, "youtube")} 
                    className="w-full aspect-video rounded-xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}

            {type === "twitter" && (
                <blockquote className="twitter-tweet">
                    <a href={link.replace("x.com", "twitter.com")} target="_blank" rel="noopener noreferrer">
                        {link}
                    </a>
                </blockquote>
            )}
        </div>
    </div>
}