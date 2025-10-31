import React from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";

// Icon tick
const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-blue-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

// Component chính
const PackageCard = ({ packageData }) => {
  const { id,type, price, postLimit, durationDays, description } = packageData;

  const isFeatured = type === "PREMIUM"; // Gói nổi bật nếu là PREMIUM

  const cardClass = `relative rounded-xl bg-white shadow-xl overflow-hidden ${
    isFeatured ? "border-2 border-yellow-400 transform scale-105" : ""
  }`;

  const headerClass = `p-6 text-white rounded-t-xl ${
    isFeatured
      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
      : "bg-gradient-to-r from-indigo-600 to-blue-600"
  }`;

  const buttonClass =
    "bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300 text-lg";
    
    const handlePayment = async () => {
      try {
        const res = await api.get("/seller/payment/seller-package", {
          params: { packageId: id },
        });

        const data = res.data;

        // ⚙️ Trường hợp backend trả về success = false → chuyển /wallet
        if (data?.success === false) {
          toast.error("Số dư không đủ. Vui lòng nạp thêm vào ví của bạn.");
          window.location.href = "/wallet";
          return;
        }

        // ✅ Nếu không có paymentUrl và success = true → báo thành công
        toast.success("Thanh toán thành công!");
      } catch (error) {
        console.error("❌ Lỗi khi thanh toán:", error);
        toast.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại!"
        );
      }
    };

  return (
    <div className={cardClass}>
      {isFeatured && (
        <div className="absolute top-4 -right-12 bg-yellow-500 text-white py-1 px-10 text-sm font-bold uppercase transform rotate-45 shadow-lg">
          Best Seller
        </div>
      )}

      {/* Header */}
      <div className={headerClass}>
        <h2 className="text-2xl font-bold mb-1">{type} Package</h2>
        <p className="text-4xl font-extrabold border-b border-white border-opacity-30 pb-3">
          {price.toLocaleString("vi-VN")}₫{" "}
          
        </p>
      </div>

      {/* Nội dung */}
      <div className="p-6 space-y-3">
        <p className="text-gray-600 italic">
          {description || "Không có mô tả cho gói này."}
        </p>

        <ul className="space-y-3">
          <li className="flex items-start border-b pb-3 last:border-b-0">
            <span className="mr-3 mt-1 text-blue-500">
              <CheckIcon />
            </span>
            <span className="text-gray-700">
              Giới hạn đăng bài: <strong>{postLimit}</strong> bài
            </span>
          </li>
          <li className="flex items-start border-b pb-3 last:border-b-0">
            <span className="mr-3 mt-1 text-blue-500">
              <CheckIcon />
            </span>
            <span className="text-gray-700">
              Thời hạn sử dụng: <strong>{durationDays}</strong> ngày
            </span>
          </li>
        </ul>
      </div>

      {/* Nút */}
      <div className="p-6 pt-0">
        <button
          className={buttonClass}
          onClick={() => {handlePayment()}}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
