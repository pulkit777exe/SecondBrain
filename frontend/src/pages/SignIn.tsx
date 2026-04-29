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
    <div className="min-h-screen w-full bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-3">
            Sign In
          </p>
          <h1 className="text-5xl font-serif text-stone-900 leading-tight">
            Welcome<br />back.
          </h1>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
              Email
            </label>
            <input 
              ref={emailRef}
              type="email" 
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className={`w-full border-b border-stone-200 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors bg-transparent ${focused === "email" ? "border-stone-900" : ""}`}
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
              Password
            </label>
            <input 
              ref={passwordRef}
              type="password" 
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className={`w-full border-b border-stone-200 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors bg-transparent ${focused === "password" ? "border-stone-900" : ""}`}
            />
          </div>
        </div>
        
        {error && (
          <p className="text-red-600 text-sm mt-4">{error}</p>
        )}
        
        <button 
          onClick={signin}
          disabled={loading}
          className="mt-10 w-full py-4 bg-stone-900 text-white font-medium hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Continue"}
        </button>
        
        <div className="mt-8 text-center">
          <span className="text-stone-400">No account? </span>
          <span onClick={() => navigate("/signup")} className="text-stone-900 cursor-pointer hover:underline">Create one</span>
        </div>
      </div>
    </div>
  );
}