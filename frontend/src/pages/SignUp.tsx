import { useState } from "react";
import axios from "axios";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export function SignUp() {

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    async function signup() {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      if (!email || !password) {
        setError("Email and password are required");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await axios.post(`${BACKEND_URL}/v1/user/register`,{
            email,
            password
        });
        navigate("/signin");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Signup failed");
      } finally {
        setLoading(false);
      }
    }

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="text-2xl text-center p-4 font-semibold">Sign Up</div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <Input placeholder="Email" ref={emailRef} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <Input placeholder="Password" ref={passwordRef} />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <div className="flex justify-center p-4">
          <Button variant="primary" text={loading ? "Loading..." : "Sign Up"} onClick={signup} disabled={loading} />
        </div>
        <div className="text-center text-sm">
          Already a user? <span onClick={() => {
            navigate("/signin");
          }} className="text-purple-600 cursor-pointer hover:underline">Sign In</span>
        </div>
      </div>
    </div>
  );
}
