import axios from "axios";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export function SignUp() {

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
  
    async function signup() {
      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;

      await axios.post(`${BACKEND_URL}/api/v1/signup`,{
          username,
          password
        })
      navigate("/signin")
      alert("You have signed in");
    }

  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded border min-w-46 p-8">
        <div className="text-2xl text-center p-4">SignUp</div>
        <span className="text-xl">
          Username:
          <Input placeholder="Username" ref={usernameRef} />
        </span>
        <span className="text-xl">
          Password:
          <Input placeholder="Password" ref={passwordRef} />
        </span>
        <div className="flex justify-center p-4">
          <Button variant="primary" text="Signup" onClick={signup} />
        </div>
        <div>
          Already a user? <span onClick={() => {
            navigate("/signin");
          }} className="text-purple-500 cursor-pointer">SIGNIN</span>
        </div>
      </div>
    </div>
  );
}
