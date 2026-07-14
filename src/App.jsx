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
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    // console.log(loginData);
    const newErrors = {};
    // Regex en test()
   // const emailPattern= /[a-z]+@[a-z]+\.[a-z]+/;
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const passwordPattern =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
   // const passwordPattern =/^.{8,}$/;
    if (loginData.email.trim() === "") {
      newErrors.email = "Email is requirad";
    } 
    else {
      if (!emailPattern.test(loginData.email)) {
        newErrors.email = "Invalid email address";
      }
    }

    if (loginData.password.trim() === "") {
      newErrors.password = "Password is requirad";
    }
    else {
      if (!passwordPattern.test(loginData.password)) {
        newErrors.password = "Invalid  password";
      }
    
    }

    setErrors(newErrors);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            loginData={loginData}
            setLoginData={setLoginData}
            handleLogin={handleLogin}
            errors={errors}
            setErrors={setErrors}
          />
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="forgotpassword" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
