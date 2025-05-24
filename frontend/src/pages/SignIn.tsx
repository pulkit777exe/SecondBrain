import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function SignIn() {

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function signin() {
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password
    }).then(response => {
        const jwt = response.data.token;
        localStorage.setItem("token", jwt);
        navigate("/");
    }).catch(error => {
        console.error("Sign-in failed:", error);
    });
  }

  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded border min-w-46 p-8">
        <div className="text-2xl text-center p-4">SignIn</div>
        <span className="text-xl">
          Username:
          <Input ref={usernameRef} placeholder="Username" />
        </span>
        <span className="text-xl">
          Password:
          <Input ref={passwordRef} placeholder="Password" />
        </span>
        <div className="flex justify-center p-4">
          <Button variant="primary" text="SignIn" onClick={signin}/>
        </div>
        <div>
          Not a user? <span onClick={() => {
            navigate("/signup");
          }} className="text-purple-500 cursor-pointer">SIGNUP</span>
        </div>
      </div>
    </div>
  );
}
