import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function SignUp() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") signup();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading]);

  async function signup() {
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!email || !password) {
      setError("Fill in both fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(`${BACKEND_URL}/v1/user/register`, { email, password });
      navigate("/signin");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-3">
            Create Account
          </p>
          <h1 className="text-5xl font-serif text-stone-900 leading-tight">
            Start<br />saving.
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
          onClick={signup}
          disabled={loading}
          className="mt-10 w-full py-4 bg-stone-900 text-white font-medium hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Continue"}
        </button>
        
        <div className="mt-8 text-center">
          <span className="text-stone-400">Have an account? </span>
          <span onClick={() => navigate("/signin")} className="text-stone-900 cursor-pointer hover:underline">Sign in</span>
        </div>
      </div>
    </div>
  );
}