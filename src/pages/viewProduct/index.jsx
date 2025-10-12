import React from "react";
import Header from "../../components/header";
import { Carousel, Typography, Button, Space, Tag, Divider } from "antd"; // Thêm Divider
import {
  ShoppingCartOutlined,
  CarOutlined,
  ThunderboltOutlined,
  DollarCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"; // Icons cho thông số kỹ thuật

const { Title, Text } = Typography;

const contentStyle = {
  margin: 0,
  height: "363px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const ViewProduct = () => {
  // Dữ liệu sản phẩm mẫu CỦA BẠN (chỉ các thuộc tính bạn đã gửi)
  const product = {
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
  };

  return (
    <div
      className="overflow-x-hidden"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-6 grid grid-cols-3 gap-4">
          {/* right*/}
          <div className="col-span-1">
            <Carousel arrows infinite={false}>
              <div>
                <h3 style={contentStyle}>1</h3>
              </div>
              <div>
                <h3 style={contentStyle}>2</h3>
              </div>
              <div>
                <h3 style={contentStyle}>3</h3>
              </div>
              <div>
                <h3 style={contentStyle}>4</h3>
              </div>
            </Carousel>
          </div>

          {/* left  */}
          <div className="col-span-2 p-4">
            <Title level={2}>{product.name}</Title>
            <Text strong style={{ fontSize: "28px", color: "#cf1322" }}>
              {product.price}
            </Text>

            <Divider />

            {/* Thông số kỹ thuật chính */}
            <Title level={4}>Thông số kỹ thuật:</Title>
            <div className="grid grid-cols-2 gap-y-2 text-base">
              <div className="flex items-center">
                <CarOutlined className="mr-2 text-blue-500" />
                <Text strong>Phạm vi hoạt động:</Text>
                <span className="ml-2">{product.specs.range}</span>
              </div>
              <div className="flex items-center">
                <ThunderboltOutlined className="mr-2 text-yellow-500" />
                <Text strong>Tốc độ tối đa:</Text>
                <span className="ml-2">{product.specs.maxSpeed}</span>
              </div>
              <div className="flex items-center">
                <DollarCircleOutlined className="mr-2 text-green-500" />
                <Text strong>Dung lượng pin:</Text>
                <span className="ml-2">{product.specs.batteryCapacity}</span>
              </div>
              <div className="flex items-center">
                <ClockCircleOutlined className="mr-2 text-purple-500" />
                <Text strong>Thời gian sạc:</Text>
                <span className="ml-2">{product.specs.chargingTime}</span>
              </div>
            </div>

            <Divider />

            {/* Thêm các nút hành động */}

            <Space size="middle" className="mt-4">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                style={{ height: "50px", fontSize: "18px", padding: "0 30px" }}
              >
                Đặt hàng ngay
              </Button>
              
            </Space>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewProduct;
