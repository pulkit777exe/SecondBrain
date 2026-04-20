import { useState, useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function SignIn() {

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signin() {
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/v1/user/login`, {
        email,
        password
      });
      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="text-2xl text-center p-4 font-semibold">Sign In</div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <Input ref={emailRef} placeholder="Email" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <Input ref={passwordRef} placeholder="Password" />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <div className="flex justify-center p-4">
          <Button variant="primary" text={loading ? "Loading..." : "Sign In"} onClick={signin} disabled={loading}/>
        </div>
        <div className="text-center text-sm">
          Not a user? <span onClick={() => {
            navigate("/signup");
          }} className="text-purple-600 cursor-pointer hover:underline">Sign Up</span>
        </div>
      </div>
    </div>
  );
}
