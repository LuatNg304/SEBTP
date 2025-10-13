import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";

const OTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, email } = location.state || {}; // lấy id, email từ state

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Kiểm tra email/id khi load trang
  useEffect(() => {
    if (!id || !email) {
      navigate("/forgot-password");
    }
  }, [id, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
        setTimeout(() => {
          navigate("/reset-password", {
            state: { id: user.id, email: user.email },
          });
        }, 1000);

      } else {
        toast.error("OTP không đúng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra OTP:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-green-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Nhập OTP</h1>
        <p className="text-sm text-gray-500 text-center mb-4">
          OTP đã gửi đến email: <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nhập OTP"
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
            {isLoading ? "Đang kiểm tra..." : "Xác nhận OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPPage;
