import { useEffect, useState } from "react";
import { Card } from "../components/Card"
import { CreateContentModal } from "../components/CreateContentModal"
import { Button } from "../components/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { SideBar } from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const contents = useContent();
  const navigate = useNavigate();
  
  function userLogin() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
    setLogin(true);
  }

  useEffect(() => {
    userLogin();
  },[login,setLogin]);

  async function shareBrain() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }

    try{
      const response = await axios.post("http://localhost:3000/api/v1/brain/share", {
        data: {
          "share": true
        },
        headers: {
          "Authorization": localStorage.getItem("token")
        }}
      );
      const data = response;
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex ml-72">
      <div>
          <SideBar />
      </div>
      <div className="p-4 bg-gray-100 w-screen h-screen duration-500">
        <CreateContentModal open={modalOpen} onClose={() => {
          setModalOpen(false);
        }} />
          <div className="flex justify-end gap-2 m-2">
            <Button variant="primary" text="Add Content" startIcon={<PlusIcon />} onClick={() => {
              setModalOpen(true);
            }}/>
            <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon />} onClick={() => {
              shareBrain();
            }}/>
          </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {contents.map(({type,link,title}) => <Card 
            type={type}
            link={link}
            title={title}
            />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
