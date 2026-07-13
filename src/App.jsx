import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: false,
  });
 const[errors, setErrors]= useState({});

  const handleLogin=()=>{
    console.log(loginData);
    const newErrors={};
    if(loginData.email.trim()===""){
      newErrors.email="Email is requirad"
    }
    if(loginData.password.trim()===""){
      newErrors.password="Password is requirad"
    }
    setErrors(newErrors);

  }

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login loginData={loginData} setLoginData={setLoginData} handleLogin={handleLogin} />}
      />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="forgotpassword" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
