import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";

const SignUp = lazy(() => import("./pages/SignUp").then(m => ({ default: m.SignUp })));
const SignIn = lazy(() => import("./pages/SignIn").then(m => ({ default: m.SignIn })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.default })));
const SharedPage = lazy(() => import("./pages/SharedPage").then(m => ({ default: m.default })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.default })));

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
}

function Landing() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return <SignIn />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Landing />} path="/" />
          <Route element={<SignIn />} path="/signin" />
          <Route element={<SignUp />} path="/signup" />
          <Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>} path="/dashboard" />
          <Route element={<SharedPage />} path="/shared/:shareLink" />
          <Route element={<NotFound />} path="*" />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
