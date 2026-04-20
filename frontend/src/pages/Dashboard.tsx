import { useEffect, useState } from "react";
import { Card } from "../components/Card"
import { CreateContentModal } from "../components/CreateContentModal"
import { useContent, Content } from "../hooks/useContent";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";

type FilterType = "all" | "youtube" | "twitter";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const { contents, loading, refresh, deleteContent } = useContent();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  async function shareBrain() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try{
      const response = await axios.post(`${BACKEND_URL}/v1/brain/share`, {
        share: true
      }, { headers: { "Authorization": token } });
      const link = response.data.link;
      setShareLink(`${window.location.origin}/shared/${link}`);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(contentId: string) {
    await deleteContent(contentId);
    setShowDeleteConfirm(null);
  }

  const filteredContents = contents.filter(item => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen w-full bg-black flex">
      <div className="hidden lg:flex lg:w-64 xl:w-72 bg-zinc-900 border-r border-zinc-800 flex-col">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">secondbrain</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => setFilter("all")}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
              filter === "all" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            All content
          </button>
          <button 
            onClick={() => setFilter("youtube")}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
              filter === "youtube" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            YouTube
          </button>
          <button 
            onClick={() => setFilter("twitter")}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
              filter === "twitter" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            Twitter
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-lg text-white placeholder-zinc-600 focus:outline-none border-b border-zinc-800 focus:border-zinc-600 pb-2 transition-colors w-full sm:w-64"
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <PlusIcon />
                <span>Add</span>
              </button>
              <button 
                onClick={shareBrain}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <ShareIcon />
                <span>Share</span>
              </button>
            </div>
          </div>

          {shareLink && (
            <div className="mb-6 p-4 bg-zinc-900 rounded-lg flex justify-between items-center">
              <span className="text-zinc-400 text-sm">{shareLink}</span>
              <button onClick={() => setShareLink(null)} className="text-zinc-500 hover:text-white">×</button>
            </div>
          )}

          {loading && (
            <p className="text-zinc-500">Loading...</p>
          )}

          {!loading && filteredContents.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-500">No content yet.</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredContents.map((item: Content) => (
              <Card 
                key={item._id}
                contentId={item.contentId}
                type={item.type}
                link={item.link}
                title={item.title}
                onDelete={(id) => setShowDeleteConfirm(id)}
              />
            ))}
          </div>
        </div>
      </div>

      <CreateContentModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={refresh} 
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-white mb-2">Delete this?</h3>
            <p className="text-zinc-400 text-sm mb-6">This can't be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-2 text-red-400 hover:text-red-300 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
