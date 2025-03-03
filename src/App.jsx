import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./screens/LoginScreen";
import Register from "./screens/RegisterScreen";
import LandingScreen from "./screens/LandingScreen";
import ForgotPassScreen from "./screens/ForgotPassScreen";
import VerifyScreen from "./screens/VerifyScreen";
import SetPassScreen from "./screens/SetPassScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LandingScreen />} />
        <Route path="/forgotpass" element={<ForgotPassScreen />} />
        <Route path="/verify" element={<VerifyScreen />} />
        <Route path="/setpass" element={<SetPassScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
