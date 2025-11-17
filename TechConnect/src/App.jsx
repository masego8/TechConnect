import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Mentorship from "./pages/Mentorship"
import Profile from "./pages/Profile";
import UnderConstruction from "./pages/UnderConstruction";





export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wip" element={<UnderConstruction />} />
      </Routes>
    </BrowserRouter>
  );
}
