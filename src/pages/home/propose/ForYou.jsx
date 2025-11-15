import React, { useEffect, useState } from "react";
import { Card, Skeleton } from "antd";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const ForYou = () => {
  const Navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchbike = async () => {
    setLoading(true);
    try {
      const res = await api.get("/public/posts/priority");
      setBikes(res.data.data);
      console.log(res.data.data);
      
    } catch (error) {
      toast.error("Lỗi rồi: " + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchbike();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Grid Xe máy điện */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? // Skeleton loading
            [1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="overflow-hidden">
                <Skeleton.Image
                  active
                  style={{ width: "100%", height: "192px" }}
                />
                <div className="p-4">
                  <Skeleton active paragraph={{ rows: 4 }} />
                </div>
              </Card>
            ))
          : // Actual data
            bikes.map((bike) => (
              <div
                key={bike.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => Navigate(`/view-product/${bike.id}`)}
              >
                {/* Ảnh sản phẩm */}
                <div className="relative">
                  <img
                    src={bike.images?.[0]}
                    alt={bike.title}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-green-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiHeart className="h-5 w-5 text-green-500" />
                  </button>
                  {bike.trusted && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                      Nổi bật
                    </span>
                  )}
                </div>

                {/* Thông tin sản phẩm */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {bike.title}
                  </h3>
                  <p className="text-green-600 font-medium text-xl mb-2">
                    {bike.price?.toLocaleString("vi-VN")} VNĐ
                  </p>

                  {/* Thông số kỹ thuật */}
                  {bike?.productType === "VEHICLE" ? (
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Hãng xe: </span>
                        {bike.vehicleBrand || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Model: </span>
                        {bike.model || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Màu sắc: </span>
                        {bike.color || "N/A"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Loại: </span>
                        {bike.batteryType || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Thương hiệu: </span>
                        {bike.batteryBrand || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Dung lượng: </span>
                        {bike.capacity ? `${bike.capacity} Ah` : "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ForYou;
