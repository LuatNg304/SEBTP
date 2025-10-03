import React from "react";
import HomePage from "./pages/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPasswordPage from "./pages/forgotPass/ForgotPasswordPage";
import OTPPage from "./pages/forgotPass/Otp";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
        <Route path="/otp" element={<OTPPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
