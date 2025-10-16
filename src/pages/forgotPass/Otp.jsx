<<<<<<< HEAD

import React, { useState } from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> feature/admin
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";

const OTPPage = () => {
  

  const navigate = useNavigate();
  const location = useLocation();

  // Nhận dữ liệu từ navigate("/otp", { state: { email, type } });
  const { email, type } = location.state || {};

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

<<<<<<< HEAD
=======
  // ✅ Kiểm tra email/id khi load trang
  useEffect(() => {
    if (!id || !email) {
      navigate("/forgot-password");
    }
  }, [id, email, navigate]);

>>>>>>> feature/admin
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Thiếu thông tin email.");
      return;
    }

    setIsLoading(true);

    try {
<<<<<<< HEAD
      // Gửi POST request đến API backend
      const response = await api.post(`/auth/verify-register`, null, {
        params: { email, otp },
      });

      // Giả sử backend trả về { success: true, message: "Xác thực thành công" }
      if (response.data?.success) {
        toast.success(response.data?.message || "Xác minh OTP thành công!");

=======
      // ✅ Gọi mock API
      const response = await api.get("/cake");
      const users = response.data;

      // ✅ Tìm user khớp email
      const user = users.find(
        (u) => u.email?.toLowerCase() === email?.toLowerCase()
      );

      console.log("User tìm được:", user);

      if (!user) {
        toast.error("Người dùng không tồn tại.");
      } else if (
       Number(user.Otp) === Number(otp) // ✅ So sánh dạng chuỗi để chắc chắn
        
      ) {  

        toast.success("OTP đúng! Chuyển sang trang đổi mật khẩu...");
>>>>>>> feature/admin
        setTimeout(() => {
          if (type === "register") {
            // Nếu xác minh OTP cho đăng ký
           navigate("/", { state: { openLogin: true } });
          } else if (type === "forgot") {
            // Nếu xác minh OTP cho quên mật khẩu
            navigate("/reset-password", { state: { email } });
          } else {
            navigate("/");
          }
        }, 1000);

      } else {
        toast.error(
          response.data?.message || "OTP không đúng hoặc đã hết hạn."
        );
      }
    } catch (error) {
<<<<<<< HEAD
      console.error(error);
      if (error.response?.status === 400) {
        toast.error("OTP không hợp lệ hoặc đã hết hạn.");
      } else if (error.response?.status === 403) {
        toast.error("Bạn không có quyền xác thực OTP này.");
      } else {
        toast.error("Lỗi hệ thống, vui lòng thử lại.");
      }
=======
      console.error("Lỗi khi kiểm tra OTP:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
>>>>>>> feature/admin
    } finally {
      setIsLoading(false);
    }
  
  };

<<<<<<< HEAD
    return (
=======
  return (
>>>>>>> feature/admin
    <div className="min-h-screen flex items-center justify-center p-4 bg-green-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Xác minh OTP</h1>
        <p className="text-sm text-gray-500 text-center mb-4">
          Mã OTP đã gửi đến email:{email}
          <span className="font-medium">{email || "Không xác định"}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
<<<<<<< HEAD
            type="number"
            placeholder="Nhập mã OTP"
=======
            type="text"
            placeholder="Nhập OTP"
>>>>>>> feature/admin
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-70"
          >
            {isLoading ? "Đang xác minh..." : "Xác nhận OTP"}
          </button>
        </form>
      </div>
      
    </div>
  );

};

export default OTPPage;
