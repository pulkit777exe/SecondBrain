import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "../components/PasswordInput";

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
      setError("Please fill in both fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(`${BACKEND_URL}/v1/user/register`, { email, password });
      navigate("/signin");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError("An account with this email already exists");
      } else if (axios.isAxiosError(err) && !err.response) {
        setError("Unable to connect. Please check your internet.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-stone-50 flex items-center justify-center p-4 lg:p-6 overflow-auto">
      <div className="w-full max-w-md min-w-0">
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
            <label htmlFor="signup-email" className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
              Email
            </label>
            <input 
              ref={emailRef}
              id="signup-email"
              type="email" 
              aria-required="true"
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className={`w-full border-b border-stone-200 py-3 text-stone-900 placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors bg-transparent ${focused === "email" ? "border-stone-900" : ""}`}
            />
          </div>
          
          <div>
            <label htmlFor="signup-password" className="block text-xs uppercase tracking-wider text-stone-500 mb-2">
              Password
            </label>
            <PasswordInput 
              ref={passwordRef}
              id="signup-password"
              aria-required="true"
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="password"
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