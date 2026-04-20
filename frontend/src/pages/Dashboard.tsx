import { useEffect, useState } from "react";
import { Card } from "../components/Card"
import { CreateContentModal } from "../components/CreateContentModal"
import { Button } from "../components/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { SideBar } from "../components/Sidebar";
import { useContent, Content } from "../hooks/useContent";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";

function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const { contents, loading, error, refresh, deleteContent } = useContent();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  async function shareBrain() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    try{
      await axios.post(`${BACKEND_URL}/v1/brain/share`, {
        share: true
      }, {
        headers: {
          "Authorization": token
        }}
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(contentId: string) {
    await deleteContent(contentId);
  }

  return (
    <div className="flex">
      <div>
          <SideBar />
      </div>
      <div className="flex-1 ml-72 p-4 bg-gray-100 min-h-screen">
        <CreateContentModal open={modalOpen} onClose={() => {
          setModalOpen(false);
        }} onSuccess={refresh} />
          <div className="flex justify-end gap-2 m-2">
            <Button variant="primary" text="Add Content" startIcon={<PlusIcon />} onClick={() => {
              setModalOpen(true);
            }}/>
            <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon />} onClick={() => {
              shareBrain();
            }}/>
          </div>
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && contents.length === 0 && (
          <div className="text-gray-500">No content yet. Add some!</div>
        )}
        <div className="flex flex-wrap gap-4">
          {contents.map((item: Content) => (
            <Card 
              key={item._id}
              contentId={item.contentId}
              type={item.type}
              link={item.link}
              title={item.title}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home;
