import axios from "axios";
import { DeleteIcon } from "../icons/DeleteIcon";
import { NotebookIcon } from "../icons/NotebookIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { BACKEND_URL } from "../config";

interface CardProps {
    title: string,
    link: string,
    type: "youtube" | "twitter"
}

async function deleteContent() {
    await axios.delete(`${BACKEND_URL}/api/v1/content/:contentId`,{
        headers:{
            "Authorization": localStorage.getItem("token")
        }
    })
}

export function Card({title, link, type}: CardProps) {
    return <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-96">
        <div className="flex justify-between items-center">
            <div className="flex gap-2">
                <span className="hover:text-gray-500 cursor-pointer">
                    <NotebookIcon />
                </span>
                {title}
            </div>
            <div className="flex gap-2 text-gray-400 hover:cursor-pointer">
                <span className="hover:text-purple-400">
                    <ShareIcon />
                </span>
                <span className="hover:text-red-500" onClick={deleteContent}>
                    <DeleteIcon  />
                </span>
            </div>
        </div>
        <div className="flex justify-between items-center gap-2 pt-4">
            {type === "youtube" &&
            <iframe src={link.replace("watch","embed").replace("?v=","/")} className="w-full rounded-xl max-h-54"></iframe>}

            {type === "twitter" && 
            <blockquote className="twitter-tweet w-full"><p lang="zxx"></p> <a href={link.replace("x.com","twitter.com")}></a></blockquote>}
        </div>
    </div>
}