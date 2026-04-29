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
    <div className="min-h-screen w-full bg-stone-50 flex">
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-stone-200 rounded-sm"
      >
        <svg className="w-6 h-6 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {(sidebarOpen || window.innerWidth >= 1024) && (
        <div className="fixed lg:static inset-0 lg:inset-auto z-40 bg-stone-50/90 lg:bg-transparent">
          <div className="fixed lg:static inset-y-0 left-0 w-64 bg-stone-50 border-r border-stone-200 flex flex-col">
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.15em] text-stone-400 mb-1">SecondBrain</p>
              <h1 className="text-2xl font-serif text-stone-900">Your Library</h1>
            </div>
            
            <nav className="flex-1 px-6 space-y-2">
              {[
                { key: "all", label: "All", count: contents.length },
                { key: "youtube", label: "YouTube", count: contents.filter(c => c.type === "youtube").length },
                { key: "twitter", label: "Twitter", count: contents.filter(c => c.type === "twitter").length }
              ].map((item) => (
                <button 
                  key={item.key}
                  onClick={() => setFilter(item.key as FilterType)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-sm text-sm transition-all duration-200 ${
                    filter === item.key 
                      ? "bg-stone-100 text-stone-900 font-medium" 
                      : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/50"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    filter === item.key ? "bg-stone-200" : "bg-stone-100"
                  }`}>{item.count}</span>
                </button>
              ))}
            </nav>

            <div className="p-6 border-t border-stone-200">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all"
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

      <div className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div className="order-2 lg:order-1 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search your library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full lg:w-80 bg-transparent border-b border-stone-200 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors"
              />
            </div>
            
            <div className="flex gap-3 order-1 lg:order-2">
              <button 
                onClick={shareBrain}
                className="px-4 py-3 bg-stone-100 border border-stone-200 text-stone-600 rounded-sm hover:bg-stone-200 hover:border-stone-300 transition-all text-sm"
              >
                Share Library
              </button>
              <button 
                onClick={openAddModal}
                className="px-5 py-3 bg-stone-900 text-white font-medium rounded-sm hover:bg-stone-800 active:scale-[0.98] transition-all"
              >
                + Add Link
              </button>
            </div>
          </div>

          {shareLink && (
            <div className="mb-8 p-4 bg-stone-100 border border-stone-200 rounded-sm flex items-center justify-between">
              <span className="text-stone-600 text-sm truncate mr-4 font-mono">{shareLink}</span>
              <button onClick={() => setShareLink(null)} className="text-stone-400 hover:text-stone-900">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🧠</div>
              <p className="text-stone-500 text-lg mb-2">No content yet</p>
              <p className="text-stone-400 text-sm">Save your first link to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredContents.map((item, index) => (
                <div 
                  key={item._id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
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
            <div className="flex justify-center gap-3 mt-12">
              <button 
                onClick={() => setPage(pagination.page - 1)} 
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-stone-100 border border-stone-200 rounded-sm text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-200 transition-all"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-stone-400">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button 
                onClick={() => setPage(pagination.page + 1)} 
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 bg-stone-100 border border-stone-200 rounded-sm text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-200 transition-all"
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
        <div className="fixed inset-0 bg-stone-50/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-sm border border-stone-200 max-w-sm w-full">
            <h3 className="text-xl font-serif text-stone-900 mb-2">Delete?</h3>
            <p className="text-stone-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 bg-stone-100 text-stone-600 rounded-sm hover:bg-stone-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-3 text-red-600 hover:bg-red-50 rounded-sm transition-all"
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