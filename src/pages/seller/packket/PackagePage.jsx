// PackagePage.jsx
import React, { useState, useEffect } from "react";

import { fetchPackages } from "./mockapi";
import PackageCard from "./PackageCard";


const PackagePage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages()
      .then((data) => {
        setPackages(data);
      })
      .catch((error) => console.error("Lỗi khi tải dữ liệu:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-xl text-gray-600">Đang tải gói dịch vụ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-8">
      {/* Phần giới thiệu */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <p className="text-gray-600 text-lg">
          Để sử dụng các tính năng đăng bài và dán nhãn kiểm duyệt chất lượng sản phẩm bạn vui lòng đăng kí gói.
        </p>
      </div>

      {/* Danh sách gói */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} packageData={pkg} />
        ))}
      </div>
    </div>
  );
};

export default PackagePage;
