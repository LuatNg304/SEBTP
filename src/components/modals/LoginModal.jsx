import React, { use, useState } from "react";
import Modal from "./Modal";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { login } from "../../redux/accountSlide";
import api from "../../config/axios";


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
      const response = await api.get("/Category"); // ví dụ mock data
      const users = response.data;

      // tìm người dùng có email và password trùng
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );
      if (user) {
        toast.success("Đăng nhập thành công!");
        onClose();
      }
      const {token} = response.data;
      localStorage.setItem("token", token);

      // lưu vào statel toàn cục
      dispatch(login(user));
      // reset form
      setFormData({
        email: "",
        password: "",
        rememberMe: false,
      });
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi đăng nhập. Vui lòng thử lại.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In">
      <div className="flex flex-col items-center mb-6">
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-3 border-2 border-emerald-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all"
        >
          <img src="/gg.png" alt="Google" className="w-5 h-5" />
          <span className="text-emerald-700">Continue with Google</span>
        </button>
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
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="rounded border-gray-300 text-green-500 focus:ring-green-300"
              />
              Remember password
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
