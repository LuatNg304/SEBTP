import React, { useState } from "react";
import Modal from "./Modal";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/accountSlice";
import { GoogleLogin } from "@react-oauth/google";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi POST request đến API với email và password
      const response = await api.post("auth/basic-login", {
        email: formData.email,
        password: formData.password,
      });
      // Lấy accessToken từ phản hồi
      const { accessToken, user } = response.data;
      if (!accessToken) {
        toast.error("Tài khoản hoặc mật khẩu không đúng!");
        return;
      }
      // Lưu accessToken vào localStorage
      localStorage.setItem("accessToken", accessToken);
      // Gửi thông tin user vào redux (tùy nếu bạn có endpoint get profile)
      // Ví dụ: lấy thông tin user từ token nếu API hỗ trợ
      dispatch(login(response.data));
      toast.success("Đăng nhập thành công!");
      // Reset form và đóng modal
      setFormData({
        email: "",
        password: "",
        rememberMe: false,
      });
      onClose();
      // Chuyển hướng sau khi login thành công
      if (user.role === "BUYER" || user.role === "SELLER") {
        navigate("/");
      }
      if (user.role === "SELLER") {
        navigate("/seller");
      } else if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.message === "Network Error") {
        toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        return;
      }
      // Nếu có lỗi từ backend
      const message =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";

      toast.error(message);
    }
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const credential = credentialResponse.credential; // JWT ID Token
    console.log("Google credential:", credential);

    try {
      // Gửi credential lên backend
      const res = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }), // gửi theo DTO bạn định nghĩa
      });

      if (!res.ok) throw new Error("Google login failed");

      const data = await res.json();
      console.log("Backend response:", data);

      onClose(); // đóng modal
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In">
      <div className="flex flex-col items-center mb-6">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Login Failed")}
        />
        <p className="text-gray-500 mt-4">or sign in with:</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Name"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center ">
            </label>
            <button
              type="button"
              className="text-sm text-red-500 hover:underline"
              onClick={() => {
                onClose(); // đóng modal login trước
                navigate("/forgot-password"); // chuyển đến trang quên mật khẩu
              }}
            >
              Forgot Password
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all font-medium shadow-md"
          >
            Sign In
          </button>

          <div className="flex items-center justify-center gap-1 text-sm">
            <span className="text-gray-500">Don't have an account?</span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
