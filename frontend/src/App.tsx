import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import SharedPage from "./pages/SharedPage";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

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
        <Routes>
          <Route element={<Landing />} path="/" />
          <Route element={<SignIn />} path="/signin" />
          <Route element={<SignUp />} path="/signup" />
          <Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>} path="/dashboard" />
          <Route element={<SharedPage />} path="/shared/:shareLink" />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
