import { useEffect, useState, useMemo } from "react";
import { Card } from "../components/Card"
import { ContentModal } from "../components/ContentModal"
import { useContent, Content } from "../hooks/useContent";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";

type FilterType = "all" | "youtube" | "twitter";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { contents, loading, refresh, deleteContent, pagination, setPage } = useContent();
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

  function openAddModal() {
    setEditMode(false);
    setEditingContent(null);
    setModalOpen(true);
  }

  function openEditModal(contentId: string) {
    const content = contents.find(c => c.contentId === contentId);
    if (content) {
      setEditMode(true);
      setEditingContent(content);
      setModalOpen(true);
    }
  }

  const filteredContents = useMemo(() => {
    let items = contents;
    if (filter !== "all") {
      items = items.filter(item => item.type === filter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => item.title.toLowerCase().includes(query));
    }
    return items;
  }, [contents, filter, searchQuery]);

return (
    <div className="min-h-screen w-full bg-black flex">
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 rounded-lg border border-zinc-800"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {(sidebarOpen || window.innerWidth >= 1024) && (
        <div className="fixed lg:static inset-0 lg:inset-auto z-40 bg-black/80 lg:bg-transparent">
          <div className="fixed lg:static inset-y-0 left-0 w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col transform transition-transform duration-300">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">secondbrain</h1>
            </div>
            
            <nav className="flex-1 px-3 space-y-1">
              {[
                { key: "all", label: "All", count: contents.length },
                { key: "youtube", label: "YouTube", count: contents.filter(c => c.type === "youtube").length },
                { key: "twitter", label: "Twitter", count: contents.filter(c => c.type === "twitter").length }
              ].map((item) => (
                <button 
                  key={item.key}
                  onClick={() => setFilter(item.key as FilterType)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    filter === item.key 
                      ? "bg-zinc-900 text-white" 
                      : "text-zinc-500 hover:text-white hover:bg-zinc-900/50"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    filter === item.key ? "bg-zinc-800" : "bg-zinc-900"
                  }`}>{item.count}</span>
                </button>
              ))}
            </nav>

            <div className="p-3 border-t border-zinc-900">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-zinc-900/50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0m-4 4h4m-4 4v4m0-4V4m0 4h4m-4 4v4m0-4V4" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="order-2 lg:order-1 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full lg:w-64 bg-zinc-950 border border-zinc-900 rounded-2xl px-5 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 order-1 lg:order-2">
              <button 
                onClick={shareBrain}
                className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-2xl hover:bg-zinc-800 transition-all text-sm"
              >
                Share
              </button>
              <button 
                onClick={openAddModal}
                className="px-5 py-2.5 bg-white text-black font-medium rounded-2xl hover:bg-zinc-200 active:scale-[0.98] transition-all"
              >
                + Add
              </button>
            </div>
          </div>

          {shareLink && (
            <div className="mb-6 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <span className="text-zinc-400 text-sm truncate mr-4">{shareLink}</span>
              <button onClick={() => setShareLink(null)} className="text-zinc-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🧠</div>
              <p className="text-zinc-500 text-lg mb-2">No content yet</p>
              <p className="text-zinc-600 text-sm">Save your first link to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredContents.map((item, index) => (
                <div 
                  key={item._id} 
                  className="animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Card 
                    contentId={item.contentId}
                    type={item.type}
                    link={item.link}
                    title={item.title}
                    tags={item.tags}
                    onDelete={(id) => setShowDeleteConfirm(id)}
                    onEdit={(id) => openEditModal(id)}
                  />
                </div>
              ))}
            </div>
          )}
          
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button 
                onClick={() => setPage(pagination.page - 1)} 
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-all"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-zinc-500">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button 
                onClick={() => setPage(pagination.page + 1)} 
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      <ContentModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={refresh}
        editMode={editMode}
        content={editingContent}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 max-w-sm w-full animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-semibold text-white mb-2">Delete?</h3>
            <p className="text-zinc-400 text-sm mb-6">This can't be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-3 text-red-400 hover:text-red-300 transition-all"
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
