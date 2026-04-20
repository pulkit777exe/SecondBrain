import { useState, useRef } from "react";
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
      setError("Please fill in all fields");
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
      navigate("/dashboard");
    } catch (err: unknown) {
      setError("Wrong email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-40 h-40 bg-zinc-700 rounded-full" />
          <div className="absolute bottom-40 right-20 w-64 h-64 bg-zinc-800 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-zinc-600 rounded-full" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-16">
          <h1 className="text-5xl font-bold text-white leading-tight">
            your<br />
            <span className="text-zinc-500">second</span><br />
            brain
          </h1>
          <p className="text-zinc-400 mt-6 text-lg">Save what matters.</p>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-black">
        <div className="w-full max-w-sm">
          <p className="text-zinc-500 text-sm mb-8">sign in</p>
          
          <h2 className="text-3xl font-semibold text-white mb-2">Hello there.</h2>
          <p className="text-zinc-400 mb-8">Enter your details to continue.</p>
          
          <div className="space-y-5">
            <div>
              <input 
                ref={emailRef}
                type="email" 
                placeholder="email"
                className="w-full bg-transparent border-b border-zinc-800 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
            <div>
              <input 
                ref={passwordRef}
                type="password" 
                placeholder="password"
                className="w-full bg-transparent border-b border-zinc-800 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
          </div>
          
          {error && (
            <p className="text-red-400 text-sm mt-4">{error}</p>
          )}
          
          <button 
            onClick={signin}
            disabled={loading}
            className="mt-10 w-full py-3 text-zinc-400 hover:text-white transition-colors flex items-center justify-between group"
          >
            <span>{loading ? "Signing in..." : "Continue"}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </button>
          
          <p className="text-zinc-600 text-sm mt-8">
            No account?{" "}
            <span 
              onClick={() => navigate("/signup")} 
              className="text-zinc-400 cursor-pointer hover:text-white transition-colors"
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
