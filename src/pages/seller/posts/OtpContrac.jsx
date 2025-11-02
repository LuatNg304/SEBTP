import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react"; // Import icon loading

export default function SignOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // Loading cho nút "Xác nhận"
  const [isResending, setIsResending] = useState(false); // Loading cho nút "Gửi lại"
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy contractId từ URL

  // Hàm "Xác nhận Ký" (gửi OTP)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("OTP phải đủ 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      // API xác thực OTP và KÝ 
      await api.post(`/seller/contracts/sign/verify`, {
        contractId: parseInt(id),
        otp: otp,
      });

      // Nếu thành công: Quay lại trang hợp đồng với state
      navigate(-1, { state: { signedSuccess: true } });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "OTP không chính xác";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // === HÀM MỚI: Gửi lại OTP ===
  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      // Gọi API gửi lại OTP (như bạn yêu cầu, bỏ body 'otp')
      await api.post(`/seller/contracts/${id}/sign/send-otp`);
      toast.success("Đã gửi lại mã OTP!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi khi gửi lại OTP";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  // === HÀM MỚI: Quay lại ===
  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước (trang hợp đồng)
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Xác thực Ký Hợp đồng
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Một mã OTP đã được gửi đến số điện thoại của bạn.
        </p>

        <label
          htmlFor="otp"
          className="block text-sm font-medium text-gray-700"
        >
          Nhập mã OTP (6 chữ số)
        </label>
        <input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="••••••"
          maxLength={6}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 mt-1 text-center text-lg tracking-[0.5em]"
        />

        {/* Nút "Xác nhận Ký" */}
        <button
          type="submit"
          disabled={loading || isResending}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            "Xác nhận Ký"
          )}
        </button>

        {/* === CÁC NÚT MỚI === */}
        <div className="flex justify-between gap-4 mt-4">
          {/* Nút "Quay lại" */}
          <button
            type="button" // Quan trọng: type="button" để không submit form
            onClick={handleGoBack}
            disabled={loading || isResending}
            className="w-1/2 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
          >
            Quay lại
          </button>

          {/* Nút "Gửi lại OTP" */}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loading || isResending}
            className="w-1/2 bg-green-100 text-green-700 p-3 rounded-lg hover:bg-green-200 disabled:bg-gray-100"
          >
            {isResending ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Gửi lại OTP"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
