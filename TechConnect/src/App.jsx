import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-2">TechConnect</h1>
      <p className="text-gray-600 mb-4">Home page</p>
      <Link
        to="/login"
        className="text-indigo-600 underline hover:text-indigo-800 transition"
      >
        Go to Login
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
