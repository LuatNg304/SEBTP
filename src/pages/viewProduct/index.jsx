import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import {
  Carousel,
  Typography,
  Button,
  Space,
  Tag,
  Divider,
  Card,
  Skeleton,
  // Descriptions, // <- Không cần dùng Descriptions nữa
} from "antd";
import {
  ShoppingCartOutlined,
  CarOutlined,
  ThunderboltOutlined,
  DollarCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  DashboardOutlined,
  CameraOutlined,
  SolutionOutlined,
  CrownOutlined,
  // BatteryChargingOutlined, // (Bạn chưa import icon này, nhưng tôi thêm vào cho mục Pin)
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import api from "../../config/axios";

const { Title, Text } = Typography;

const contentStyle = {
  margin: 0,
  height: "400px",
  color: "#8c8c8c",
  textAlign: "center",
  background: "#f0f0f0",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  border: "1px dashed #d9d9d9",
};

const ViewProduct = () => {
  const [item, setItem] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchitem = async () => {
      try {
        const response = await api.get(
          `/public/posts/post-detail?postId=${id}`
        );
        setItem(response.data);
      } catch (error) {
        console.log("Lỗi tải chi tiết sản phẩm:", error);
      }
    };
    fetchitem();
  }, [id]);

  const postData = item?.data;
  const images = postData?.images || [];

  const ModernLoading = () => (
    // ... (Phần loading giữ nguyên, không thay đổi)
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <Card bordered={false} className="shadow-xl rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
          <div className="md:col-span-1">
            <Skeleton.Image
              active
              style={{ width: "100%", height: 400, borderRadius: 12 }}
            />
          </div>
          <div className="md:col-span-2">
            <Skeleton active title={{ width: "60%" }} paragraph={{ rows: 6 }} />
            <Divider />
            <Skeleton
              active
              paragraph={{ rows: 4, width: ["100%", "80%", "90%", "70%"] }}
            />
          </div>
        </div>
      </Card>
    </main>
  );

  if (!postData) {
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
        <ModernLoading />
      </div>
    );
  }

  // Chuyển đổi trạng thái trusted để phù hợp với hiển thị "Đã kiểm duyệt"
  const isTrusted = postData.trusted;

  // --- BẮT ĐẦU: Helper function mới ---
  // (Giữ nguyên helper function 'renderInfoItem' như cũ)
  const renderInfoItem = (label, value) => {
    if (!value && value !== 0) {
      return null;
    }
    let displayValue = value;
    if (label === "Màu sắc" && typeof value === "string") {
      displayValue = (
        <Tag color={value.toLowerCase()} className="font-medium text-base !text-black">
          {value}
        </Tag>
      );
    }
    return (
      <div>
        <Text type="secondary" className="block text-sm mb-1">
          {label}
        </Text>
        <Text strong className="text-base font-semibold text-gray-900">
          {displayValue}
        </Text>
      </div>
    );
  };
  // --- KẾT THÚC: Helper function mới ---

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

      {/* === BẮT ĐẦU LAYOUT 2 CỘT MỚI === */}
      <main className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* === CỘT BÊN TRÁI (Nội dung chính) === */}
          <div className="lg:col-span-2 space-y-1 ">
            <Carousel
              arrows
              infinite={true}
              dots={{ className: "carousel-dots" }}
              className="rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-2"
            >
              {images.length > 0 ? (
                images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`${postData.title} - Ảnh ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))
              ) : (
                <div>
                  <div style={contentStyle}>
                    <CameraOutlined
                      style={{ fontSize: "48px", color: "#bfbfbf" }}
                    />
                    <Text type="secondary" className="mt-3 text-lg">
                      Chưa có hình ảnh nào
                    </Text>
                  </div>
                </div>
              )}
            </Carousel>

            {/* Card 2: Chứa Thông số & Mô tả */}
            <Card bordered={false} className="shadow-2xl rounded-xl p-4">
              {/* Thông số kỹ thuật chính */}
              <Title
                level={3}
                className="mb-6 border-b pb-3 flex items-center text-gray-800"
              >
                Thông tin chi tiết sản phẩm
              </Title>

              {/* Layout Grid cho thông số (giữ nguyên) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 p-4">
                {/* === Dữ liệu Xe Cộ === */}
                {postData.productType === "VEHICLE" && (
                  <>
                    {renderInfoItem(
                      "Số Km đã đi",
                      postData.mileage
                        ? `${postData.mileage.toLocaleString("vi-VN")} km`
                        : null
                    )}
                    {renderInfoItem("Thương hiệu", postData.vehicleBrand)}
                    {renderInfoItem("Mẫu xe/Model", postData.model)}
                    {renderInfoItem("Năm sản xuất", postData.yearOfManufacture)}
                    {renderInfoItem("Màu sắc", postData.color)}
                  </>
                )}

                {/* === Dữ liệu Pin/Ắc quy === */}
                {postData.productType !== "VEHICLE" && (
                  <>
                    {renderInfoItem("Loại Pin", postData.batteryType)}
                    {renderInfoItem("Thương hiệu Pin", postData.batteryBrand)}
                    {renderInfoItem(
                      "Dung lượng",
                      postData.capacity ? `${postData.capacity} Ah` : null
                    )}
                    {renderInfoItem(
                      "Điện áp",
                      postData.voltage ? `${postData.voltage} V` : null
                    )}
                  </>
                )}

                {/* === Thông tin chung === */}
                {renderInfoItem(
                  "Ngày đăng",
                  postData.postDate
                    ? new Date(postData.postDate).toLocaleDateString("vi-VN")
                    : null
                )}
                
                <div className="sm:col-span-2 lg:col-span-2">
                  {renderInfoItem("Địa chỉ", postData.address)}
                </div>
              </div>

              <Divider className="my-8" />

              {/* Mô tả sản phẩm */}
              <Title level={3} className="mb-4 flex items-center text-gray-800">
                <SolutionOutlined className="mr-3 text-purple-600 text-3xl" />{" "}
                Mô tả sản phẩm
              </Title>
              <div className="p-6 bg-gray-50 rounded-lg border border-gray-100 shadow-inner">
                <Text className="text-gray-700 whitespace-pre-line block leading-relaxed text-base">
                  {postData.description ||
                    "Sản phẩm hiện chưa có mô tả chi tiết từ người bán. Vui lòng liên hệ để biết thêm thông tin!"}
                </Text>
              </div>
            </Card>
          </div>
          {/* === HẾT CỘT BÊN TRÁI === */}

          {/* === CỘT BÊN PHẢI (Hành động & Người bán) === */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card 1: Chứa Thông tin, Giá, Nút bấm */}
            <Card bordered={false} className="shadow-2xl rounded-xl p-6">
              <Title
                level={2}
                className="text-gray-900 font-extrabold mb-2 leading-tight"
              >
                {postData.title}
              </Title>

              <Space wrap size={[0, 8]} className="mb-4">
                <Tag
                  color="blue"
                  className="text-base font-semibold border-0 py-1 px-3 rounded-full"
                >
                  <CarOutlined className="mr-1" />
                  {postData.productType === "VEHICLE"
                    ? "Sản phẩm Xe Cộ"
                    : "Ắc quy/Pin điện"}
                </Tag>
                {isTrusted && (
                  <Tag
                    color="green"
                    icon={<CrownOutlined />}
                    className="text-base font-semibold border-0 py-1 px-3 rounded-full"
                  >
                    Đã kiểm duyệt
                  </Tag>
                )}
                {postData.status === "PENDING" && (
                  <Tag
                    color="orange"
                    className="text-base font-semibold border-0 py-1 px-3 rounded-full"
                  >
                    Đang chờ duyệt
                  </Tag>
                )}
              </Space>

              {/* Phần Giá Nổi Bật */}
              <div className="bg-red-50 p-5 rounded-xl border-l-4 border-red-600 my-5 flex items-baseline justify-between">
                <div>
                  <Text type="secondary" className="block text-lg mb-1">
                    Giá bán:
                  </Text>
                  <Text
                    strong
                    style={{ fontSize: "48px", color: "#cf1322" }}
                    className="font-extrabold"
                  >
                    {postData.price && typeof postData.price === "number"
                      ? postData.price.toLocaleString("vi-VN")
                      : "Liên hệ"}{" "}
                    <span className="text-3xl">VNĐ</span>
                  </Text>
                </div>
                {postData.suggestPrice > 0 && (
                  <div className="text-right">
                    <Text
                      type="secondary"
                      className="block text-md line-through"
                    >
                      Giá đề xuất:{" "}
                      {postData.suggestPrice.toLocaleString("vi-VN")} VNĐ
                    </Text>
                  </div>
                )}
              </div>

              <Divider className="my-6" />

              {/* Thêm các nút hành động */}
              <Space size="large" className="mt-4 flex flex-wrap">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  style={{
                    height: "58px",
                    fontSize: "19px",
                    padding: "0 45px",
                    background: "#cf1322",
                    borderColor: "#cf1322",
                    borderRadius: "10px",
                  }}
                  className="hover:bg-red-700 transition-colors shadow-lg"
                >
                  Đặt hàng ngay
                </Button>
                <Button
                  size="large"
                  icon={<SolutionOutlined />}
                  style={{
                    height: "58px",
                    fontSize: "19px",
                    padding: "0 30px",
                    borderRadius: "10px",
                  }}
                  className="hover:border-blue-500 hover:text-blue-500 transition-colors shadow-lg"
                >
                  Liên hệ người bán
                </Button>
              </Space>
            </Card>

            {/* Card 2: Chứa Thông tin người bán */}
            {postData.user && (
              <Card bordered={false} className="shadow-2xl rounded-xl p-4">
                <Title
                  level={3}
                  className="mb-4 flex items-center text-gray-800"
                >
                  <CrownOutlined className="mr-3 text-orange-500 text-3xl" />{" "}
                  Thông tin người bán
                </Title>

                {/* Layout Grid cho thông tin người bán (giữ nguyên) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8 p-4">
                  {renderInfoItem(
                    "Tên cửa hàng",
                    postData.user.storeName || postData.user.fullName
                  )}
                  {renderInfoItem("Email", postData.user.email)}
                  {renderInfoItem("Số điện thoại", postData.user.phone)}
                  <div className="sm:col-span-2">
                    {renderInfoItem(
                      "Mô tả cửa hàng",
                      postData.user.storeDescription ||
                        "Chưa có mô tả cửa hàng."
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
          {/* === HẾT CỘT BÊN PHẢI === */}
        </div>
      </main>
      {/* === KẾT THÚC LAYOUT 2 CỘT === */}
    </div>
  );
};

export default ViewProduct;
