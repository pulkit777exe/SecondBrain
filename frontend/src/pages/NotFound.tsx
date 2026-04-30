import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-stone-50 flex items-center justify-center p-6">
            <div className="text-center">
                <h1 className="text-8xl font-serif text-stone-900 mb-4">404</h1>
                <p className="text-xl text-stone-600 mb-8">Page not found</p>
                <p className="text-stone-400 mb-8">The page you're looking for doesn't exist.</p>
                <button 
                    onClick={() => navigate("/dashboard")}
                    className="px-6 py-3 bg-stone-900 text-white font-medium rounded-md hover:bg-stone-800 transition-all"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
}