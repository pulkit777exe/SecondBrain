import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter"
}

interface CreateContentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function CreateContentModal({open, onClose, onSuccess}: CreateContentModalProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState<ContentType>(ContentType.Youtube);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;
        
        if (!title || !link) {
            setError("Title and link are required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await axios.post(`${BACKEND_URL}/v1/content`, {
                link,
                title,
                type
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            })
            onClose();
            onSuccess?.();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to add content");
        } finally {
            setLoading(false);
        }
    }

    return <div>
        {open && <div> 
            <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center">
               
            </div>
            <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Add Content</h2>
                        <div onClick={onClose} className="cursor-pointer">
                            <CrossIcon />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Input ref={titleRef} placeholder={"Title"} />
                        <Input ref={linkRef} placeholder={"Link"} />
                    </div>
                    <div className="mt-4">
                        <p className="mb-2 text-sm text-gray-600">Type</p>
                        <div className="flex gap-2">
                            <Button 
                                text="Youtube" 
                                variant={type === ContentType.Youtube ? "primary" : "secondary"} 
                                onClick={() => setType(ContentType.Youtube)}
                            />
                            <Button 
                                text="Twitter" 
                                variant={type === ContentType.Twitter ? "primary" : "secondary"} 
                                onClick={() => setType(ContentType.Twitter)}
                            />
                        </div>
                    </div>
                    {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
                    <div className="flex justify-center mt-4">
                        <Button onClick={addContent} variant="primary" text={loading ? "Loading..." : "Submit"} disabled={loading} />
                    </div>
                </div>     
            </div>
            
        </div>}
    </div>

 }