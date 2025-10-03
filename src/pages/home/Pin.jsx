import React from 'react'
import { Card } from 'antd';
const { Meta } = Card;
import { FiHeart } from "react-icons/fi";
const Pin = () => {
    const bikes = [
    {
      id: 1,
      name: "VinFast Theon S",
      price: "69.900.000 VNĐ",
      image:
        "https://vinfastauto.com/sites/default/files/styles/images_1440_x_623/public/2023-07/theon-s-hinh-anh-gif_0.gif",
      specs: {
        range: "150 km",
        maxSpeed: "90 km/h",
        batteryCapacity: "3.5 kWh",
        chargingTime: "6 giờ",
      },
      features: ["Khóa thông minh", "Định vị GPS", "Chống trộm"],
      rating: 4.8,
      status: "Còn hàng",
      featured: true,
    },
    {
      id: 2,
      name: "VinFast Klara S",
      price: "39.900.000 VNĐ",
      image:
        "https://vinfastauto.com/sites/default/files/styles/images_1440_x_623/public/2023-07/klara-s-2022-hinh-anh-gif_0.gif",
      specs: {
        range: "120 km",
        maxSpeed: "60 km/h",
        batteryCapacity: "2.9 kWh",
        chargingTime: "5 giờ",
      },
      features: ["Chống nước IP67", "Đèn LED", "Phanh ABS"],
      rating: 4.5,
      status: "Còn hàng",
      featured: false,
    },
    {
      id: 3,
      name: "Yadea G5",
      price: "35.900.000 VNĐ",
      image:
        "https://bizweb.dktcdn.net/100/440/241/products/xe-may-dien-yadea-g5-pro.jpg",
      specs: {
        range: "100 km",
        maxSpeed: "55 km/h",
        batteryCapacity: "2.4 kWh",
        chargingTime: "4 giờ",
      },
      features: ["Màn hình LCD", "Khóa từ", "Phanh đĩa"],
      rating: 4.3,
      status: "Còn hàng",
      featured: true,
    },
    {
      id: 4,
      name: "Dibao Jeek",
      price: "29.900.000 VNĐ",
      image:
        "https://dibamotors.com.vn/wp-content/uploads/2023/02/z4134419749880_73ab778e78ead824323c10ea42a4a8c4.jpg",
      specs: {
        range: "90 km",
        maxSpeed: "50 km/h",
        batteryCapacity: "2.0 kWh",
        chargingTime: "4 giờ",
      },
      features: ["Đèn LED", "Khóa điện tử", "Phanh đĩa"],
      rating: 4.2,
      status: "Hết hàng",
      featured: false,
    },
    {
      id: 5,
      name: "Pega NewTech",
      price: "32.900.000 VNĐ",
      image:
        "https://xedienvietthanh.com/wp-content/uploads/2021/09/xe-may-dien-pega-newtech-mau-den.jpg",
      specs: {
        range: "110 km",
        maxSpeed: "60 km/h",
        batteryCapacity: "2.6 kWh",
        chargingTime: "5 giờ",
      },
      features: ["Khóa chống trộm", "Đèn pha LED", "Phanh CBS"],
      rating: 4.4,
      status: "Còn hàng",
      featured: true,
    },
    {
      id: 6,
      name: "Niu NQi GTS",
      price: "55.900.000 VNĐ",
      image:
        "https://niuvietnam.vn/wp-content/uploads/2023/05/xe-dien-niu-nqi-gts-pro-mau-den.jpg",
      specs: {
        range: "140 km",
        maxSpeed: "75 km/h",
        batteryCapacity: "3.1 kWh",
        chargingTime: "5.5 giờ",
      },
      features: ["App kết nối", "Định vị GPS", "Chống trộm"],
      rating: 4.7,
      status: "Còn hàng",
      featured: true,
    },
  ];
  return (
    <div className="container mx-auto px-4 py-8">
          {/* Grid Xe máy điện */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bikes.map((bike) => (
              <div
                key={bike.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Ảnh sản phẩm */}
                <div className="relative">
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="w-full h-48 object-cover"
                    // onError={(e) => {
                    //   e.target.src =
                    //     "https://via.placeholder.com/400x300?text=Xe+máy+điện";
                    // }}
                  />
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-green-50">
                    <FiHeart className="h-5 w-5 text-green-500" />
                  </button>
                  {bike.featured && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                      Nổi bật
                    </span>
                  )}
                </div>
    
                {/* Thông tin sản phẩm */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{bike.name}</h3>
                  <p className="text-green-600 font-medium mb-2">{bike.price}</p>
    
                  {/* Thông số kỹ thuật */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Quãng đường: </span>
                      {bike.specs.range}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tốc độ tối đa: </span>
                      {bike.specs.maxSpeed}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Dung lượng pin: </span>
                      {bike.specs.batteryCapacity}
                    </p>
                  </div>
    
                  {/* Tính năng */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bike.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  )
}

export default Pin
