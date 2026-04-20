import Home from "./pages/Dashboard";
import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<SignIn />} path="/signin" />
        <Route element={<SignUp />} path="/signup" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
