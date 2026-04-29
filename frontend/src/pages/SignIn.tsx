import { useState, useRef, useEffect } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") signin();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading]);

  async function signin() {
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!email || !password) {
      setError("Fill in both fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/v1/user/login`, {
        email,
        password
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch {
      setError("Wrong email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-20 w-96 h-96 bg-zinc-800/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl" />
        </div>
      </div>
      
      <div className="relative z-10 w-full max-w-80 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-white tracking-tight mb-2">secondbrain</h1>
          <p className="text-zinc-500">your digital memory</p>
        </div>
        
        <div className="space-y-3">
          <div className={`relative transition-all duration-300 ${focused === "email" ? "scale-[1.02]" : ""}`}>
            <input 
              ref={emailRef}
              type="email" 
              placeholder="email"
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className={`w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-all duration-200 ${focused === "email" ? "bg-zinc-900 shadow-lg shadow-zinc-900/50" : ""}`}
            />
          </div>
          <div className={`relative transition-all duration-300 ${focused === "password" ? "scale-[1.02]" : ""}`}>
            <input 
              ref={passwordRef}
              type="password" 
              placeholder="password"
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className={`w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-all duration-200 ${focused === "password" ? "bg-zinc-900 shadow-lg shadow-zinc-900/50" : ""}`}
            />
          </div>
        </div>
        
        {error && (
          <p className="text-red-400 text-sm mt-4 text-center animate-pulse">{error}</p>
        )}
        
        <button 
          onClick={signin}
          disabled={loading}
          className="w-full mt-8 py-4 bg-white text-black font-medium rounded-2xl hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Signing in...
            </span>
          ) : "Continue"}
        </button>
        
        <div className="text-center mt-8">
          <span className="text-zinc-600">No account? </span>
          <span onClick={() => navigate("/signup")} className="text-white cursor-pointer hover:underline">Create one</span>
        </div>
      </div>
    </div>
  );
}