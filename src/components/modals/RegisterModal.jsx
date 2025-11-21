import React, { useState } from "react";
import Modal from "./Modal";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import TermsModal from "./TermsModal";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { login } from "../../redux/accountSlice";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    isOver18: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Xử lý Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);

      // Chỉ gửi credential lên backend
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.isOver18) {
      toast.error("Bạn phải xác nhận trên 18 tuổi để tiếp tục.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        fullName: values.fullName,
      });

      const { success, message, data } = response.data;

      if (success) {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP."
        );

        setValues({
          email: "",
          fullName: "",
          password: "",
          confirmPassword: "",
          isOver18: false,
        });

        setTimeout(() => {
          onClose();
          navigate("/otp", {
            state: {
              email: values.email,
              type: "register",
            },
          });
        }, 800);
      } else {
        toast.error(message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create your account">
      {/* Google Sign Up */}
      <div className="flex flex-col items-center mb-6">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="outline"
          size="large"
          text="signup_with"
          shape="rectangular"
          logo_alignment="left"
        />
        <p className="text-gray-500 mt-4">or sign up with:</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Inputs */}
        <input
          type="text"
          name="fullName"
          placeholder="Full name"
          value={values.fullName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
          required
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password (min. 8 char)"
            value={values.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={values.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isOver18"
            name="isOver18"
            checked={values.isOver18}
            onChange={handleChange}
            className="rounded border-gray-300 text-green-500 focus:ring-green-400"
          />
          <label htmlFor="isOver18" className="text-sm text-gray-600">
            Tôi xác nhận rằng tôi đã trên 18 tuổi
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all font-medium shadow-md"
        >
          {isLoading ? "Đang tạo tài khoản..." : "Create account"}
        </button>

        {/* Switch to Login */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors duration-150"
          >
            Sign in
          </button>
        </p>

        {/* Terms & Privacy */}
        <p className="text-xs text-center text-gray-500">
          By clicking "Create account", you agree to our{" "}
          <button
            type="button"
            className="text-emerald-600 hover:underline"
            onClick={() => setShowTerms(true)}
          >
            Terms & Privacy
          </button>
          <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </p>
      </form>
    </Modal>
  );
};

export default RegisterModal;
