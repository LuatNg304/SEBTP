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
  const [isLoading, setIsLoading] = useState(false);
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
      // Gửi thông tin user vào redux
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
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "SELLER") {
        navigate("/seller");
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

  // Xử lý Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);

      // Gửi credential lên backend
      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      // Lấy accessToken và user từ response.data
      const { accessToken, user } = response.data;

      if (accessToken) {
        // Lưu accessToken vào localStorage
        localStorage.setItem("accessToken", accessToken);
        
        // Dispatch vào Redux
        dispatch(login(response.data));
        
        toast.success("Đăng nhập thành công!");

        // Đóng modal
        onClose();

        // Chuyển hướng theo role
        if (user.role === "ADMIN") {
          navigate("/admin");
        } else if (user.role === "SELLER") {
          navigate("/seller");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Đăng nhập Google thất bại.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      const msg =
        error.response?.data?.message || "Lỗi khi đăng nhập với Google.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đăng nhập">
      {/* Google Sign In Button */}
      <div className="flex flex-col items-center mb-6">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          logo_alignment="left"
        />
        <p className="text-gray-500 mt-4">hoặc đăng nhập bằng:</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
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
              placeholder="Mật khẩu"
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
                onClose();
                navigate("/forgot-password");
              }}
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all font-medium shadow-md disabled:opacity-50"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="flex items-center justify-center gap-1 text-sm">
            <span className="text-gray-500">Chưa có tài khoản?</span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
