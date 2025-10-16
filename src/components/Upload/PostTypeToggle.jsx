import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LucideCar, LucideBattery } from "lucide-react";

const PostTypeToggle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định trang hiện tại
  const currentType = location.pathname.includes("vehicle")
    ? "vehicle"
    : "battery";

  return (
    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6 shadow-inner">
      <button
        type="button"
        onClick={() => navigate("/seller/post/vehicle")}
        className={`flex-1 flex items-center justify-center p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
          currentType === "vehicle"
            ? "bg-emerald-600 text-white shadow-md"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        <LucideCar size={20} className="mr-2" /> Đăng bán Xe
      </button>
      <button
        type="button"
        onClick={() => navigate("/seller/post/battery")}
        className={`flex-1 flex items-center justify-center p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
          currentType === "battery"
            ? "bg-emerald-600 text-white shadow-md"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        <LucideBattery size={20} className="mr-2" /> Đăng bán Pin
      </button>
    </div>
  );
};

export default PostTypeToggle;
