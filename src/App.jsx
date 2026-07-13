 import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";

function App() {

  const [eMail, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");

  return (
    <Routes>
      <Route path="/login" element={<Login eMail={eMail} setEmail={setEmail} passWord={passWord} setPassWord={setPassWord} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="forgotpassword" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
