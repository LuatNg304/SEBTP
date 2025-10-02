import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { id, email } = location.state || {}; // nhận id và email từ OTP page

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    try {
      // Gọi API mock để cập nhật mật khẩu
      await axios.put(
        `https://68d2aeb4cc7017eec544da0a.mockapi.io/Category/${id}`,
        {
          password,
        }
      );

      setMessage("Đổi mật khẩu thành công! Chuyển về trang đăng nhập...");
      setIsError(false);

      setTimeout(() => {
        navigate("/"); // chuyển về login
      }, 1500);
    } catch (error) {
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p>
          Người dùng không hợp lệ. Vui lòng làm lại quy trình quên mật khẩu.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-green-200">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          Đặt Lại Mật Khẩu
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">Email: {email}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {message && (
            <div
              className={`p-2 text-sm rounded ${
                isError
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-70"
          >
            {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
