import React, { useEffect, useState } from "react";
import PackageCard from "./PackageCard";
import api from "../../../config/axios";


const PackagePage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/seller/seller-packages");
        setPackages(res.data);
      } catch (err) {
        console.error("❌ Lỗi tải gói dịch vụ:", err);
        setError(
          err.response?.data?.message ||
            "Máy chủ đang gặp sự cố, vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-xl text-gray-600">Đang tải gói dịch vụ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-2xl text-red-500 mb-4">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-8">
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Gói Dịch Vụ Dành Cho Người Bán
        </h1>
        <p className="text-gray-600 text-lg">
          Để sử dụng các tính năng đăng bài và kiểm duyệt chất lượng sản phẩm,
          bạn vui lòng đăng ký gói phù hợp.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} packageData={pkg} />
        ))}
      </div>
    </div>
  );
};

export default PackagePage;
