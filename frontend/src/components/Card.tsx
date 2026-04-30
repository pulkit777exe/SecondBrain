import React, { useEffect, useState } from "react";

const oembedCache = new Map<string, string>();
import { DeleteIcon } from "../icons/DeleteIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { RedditIcon } from "../icons/RedditIcon";
import { GithubIcon } from "../icons/GithubIcon";
import { LinkedInIcon } from "../icons/LinkedInIcon";
import { SpotifyIcon } from "../icons/SpotifyIcon";
import { SoundCloudIcon } from "../icons/SoundCloudIcon";
import { LoomIcon } from "../icons/LoomIcon";
import { EditIcon } from "../icons/EditIcon";

type ContentType = "youtube" | "twitter" | "instagram" | "reddit" | "github" | "linkedin" | "spotify" | "soundcloud" | "loom";

interface CardProps {
    title: string,
    link: string,
    type: ContentType,
    contentId: string,
    tags?: { title: string }[];
    onDelete?: (contentId: string) => void
    onEdit?: (contentId: string) => void
}

function getIcon(type: ContentType) {
    switch (type) {
        case "youtube": return <YoutubeIcon />;
        case "twitter": return <TwitterIcon />;
        case "instagram": return <InstagramIcon />;
        case "reddit": return <RedditIcon />;
        case "github": return <GithubIcon />;
        case "linkedin": return <LinkedInIcon />;
        case "spotify": return <SpotifyIcon />;
        case "soundcloud": return <SoundCloudIcon />;
        case "loom": return <LoomIcon />;
    }
}

function getColor(type: ContentType) {
    switch (type) {
        case "youtube": return "bg-red-100";
        case "twitter": return "bg-sky-100";
        case "instagram": return "bg-pink-100";
        case "reddit": return "bg-orange-100";
        case "github": return "bg-gray-100";
        case "linkedin": return "bg-blue-100";
        case "spotify": return "bg-green-100";
        case "soundcloud": return "bg-orange-100";
        case "loom": return "bg-purple-100";
    }
}

function getPlatformUrl(url: string, type: ContentType): string {
    switch (type) {
        case "twitter":
            return url.replace("x.com", "twitter.com");
        case "instagram":
            return url.includes("instagram.com") ? url : `https://www.instagram.com/${url.replace(/[^a-zA-Z0-9._]/g, "")}`;
        case "reddit":
            return url.includes("reddit.com") ? url : `https://www.reddit.com/${url}`;
        case "github":
            return url.includes("github.com") ? url : `https://github.com/${url}`;
        case "linkedin":
            return url.includes("linkedin.com") ? url : `https://www.linkedin.com/posts/${url}`;
        default:
            return url;
    }
}

function getEmbedUrl(url: string, type: ContentType): string | null {
    if (type === "youtube") {
        const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    }
    if (type === "spotify") {
        const spotifyMatch = url.match(/spotify\.com\/(track|episode|playlist|album|show)\/([a-zA-Z0-9]+)/);
        if (spotifyMatch) {
            return `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}`;
        }
    }
    if (type === "loom") {
        const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
        if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;
    }
    return null;
}

function getOembedUrl(url: string, type: ContentType): string | null {
    if (type === "twitter") {
        const match = url.match(/twitter\.com\/([^\/]+)\/status\/(\d+)/);
        if (match) return `https://publish.twitter.com/oembed?url=https://twitter.com/${match[1]}/status/${match[2]}&hide_media=false`;
    }
    if (type === "reddit") {
        const match = url.match(/reddit\.com\/r\/([^\/]+)\/comments\/([a-z0-9]+)/i);
        if (match) return `https://www.reddit.com/oembed?url=https://www.reddit.com/r/${match[1]}/comments/${match[2]}/`;
    }
    if (type === "instagram") {
        const match = url.match(/instagram\.com\/p\/([a-zA-Z0-9_-]+)/);
        if (match) return `https://api.instagram.com/oembed?url=https://www.instagram.com/p/${match[1]}/`;
    }
    return null;
}

function CardComponent({title, link, type, contentId, tags, onDelete, onEdit}: CardProps) {
    const [oembedHtml, setOembedHtml] = useState("");
    const [loading, setLoading] = useState(false);

    const embedUrl = getEmbedUrl(link, type);
    const oembedUrl = getOembedUrl(link, type);

    useEffect(() => {
        if (!oembedUrl) return;
        
        const cached = oembedCache.get(oembedUrl);
        if (cached) {
            setOembedHtml(cached);
            return;
        }
        
        if (!oembedHtml) {
            setLoading(true);
            fetch(oembedUrl)
                .then(res => res.json())
                .then(data => {
                    const html = (data.html || "").replace(/<script[\s\S]*?<\/script>/gi, "");
                    oembedCache.set(oembedUrl, html);
                    setOembedHtml(html);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [oembedUrl, oembedHtml]);

    const getDisplayContent = () => {
        if (embedUrl) {
            if (type === "youtube") {
                return (
                    <div className="aspect-video rounded-sm overflow-hidden bg-stone-100">
                        <iframe 
                            src={embedUrl} 
                            className="w-full h-full object-cover"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                            title={`YouTube embed: ${title}`}
                        />
                    </div>
                );
            }
            if (type === "spotify" || type === "loom") {
                return (
                    <iframe 
                        src={embedUrl}
                        className="w-full h-32 rounded-sm"
                        frameBorder="0"
                        allowFullScreen
                        loading="lazy"
                        title={`${type} embed: ${title}`}
                    />
                );
            }
        }

        if (oembedHtml) {
            return (
                <div dangerouslySetInnerHTML={{ __html: oembedHtml }} />
            );
        }

        if (loading) {
            return (
                <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 border border-stone-300 border-t-stone-600 rounded-full animate-spin" />
                </div>
            );
        }

        return (
            <a 
                href={getPlatformUrl(link, type)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-6 text-sm text-stone-600 hover:text-stone-800 bg-stone-50"
            >
                {getIcon(type)}
                <span>View on {type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </a>
        );
    };

    return (
        <div className="group bg-white rounded-sm border border-stone-200 p-4 hover:border-stone-400 transition-all duration-300">
            <div className="relative">
                <div className="rounded-sm overflow-hidden bg-white">
                    {getDisplayContent()}
                </div>

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button 
                        className="p-2 bg-white border border-stone-200 rounded-sm text-stone-500 hover:text-stone-900 hover:border-stone-400 transition-all"
                        aria-label="Share link"
                        title="Share"
                    >
                        <ShareIcon />
                    </button>
                    <button 
                        className="p-2 bg-white border border-stone-200 rounded-sm text-stone-500 hover:text-stone-900 hover:border-stone-400 transition-all"
                        onClick={() => onEdit?.(contentId)}
                        aria-label="Edit content"
                        title="Edit"
                    >
                        <EditIcon />
                    </button>
                    <button 
                        className="p-2 bg-white border border-stone-200 rounded-sm text-stone-500 hover:text-red-600 hover:border-red-200 transition-all"
                        onClick={() => onDelete?.(contentId)}
                        aria-label="Delete content"
                        title="Delete"
                    >
                        <DeleteIcon />
                    </button>
                </div>
            </div>

            <div className="pt-3">
                <div className="flex items-center gap-2 mb-2 min-w-0">
                    <div className={`p-1 rounded-sm ${getColor(type)} shrink-0`}>
                        {getIcon(type)}
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

export const Card = React.memo(CardComponent, (prevProps, nextProps) => {
    return (
        prevProps.title === nextProps.title &&
        prevProps.link === nextProps.link &&
        prevProps.type === nextProps.type &&
        prevProps.contentId === nextProps.contentId &&
        prevProps.tags === nextProps.tags
    );
});