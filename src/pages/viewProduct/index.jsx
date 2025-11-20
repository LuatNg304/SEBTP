import React, { useEffect, useState, useRef } from "react";
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
} from "antd";
import {
  ShoppingCartOutlined,
  CarOutlined,
  CameraOutlined,
  CrownOutlined,
  SwapOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { FiHeart } from "react-icons/fi";
import { useSelector } from "react-redux";
import Compare from "./Compare";

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
  const [replateProduct, setPreplateProduct] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedProductToCompare, setSelectedProductToCompare] =
    useState(null);
  const compareRef = useRef(null);
  const isLogin = useSelector((state) => state.account);
  const postData = item?.data;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchitem = async () => {
      try {
        const response = await api.get(
          `/public/posts/post-detail?postId=${id}`
        );
        setItem(response.data);
        console.log("✅ Load sản phẩm chính:", response.data);
      } catch (error) {
        console.log("❌ Lỗi:", error);
        toast.error("Không thể tải sản phẩm");
      }
    };
    fetchitem();
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!postData?.productType) {
        console.log("⏳ Chưa có productType");
        return;
      }

      try {
        console.log(`🔍 Fetch loại: ${postData.productType}`);
        const res = await api.get(`/public/posts/type/${postData.productType}`);

        // Lọc bỏ sản phẩm hiện tại khỏi danh sách liên quan
        const filteredProducts = res.data.data.filter(
          (product) => product.id !== parseInt(id)
        );

        setPreplateProduct({
          ...res.data,
          data: filteredProducts,
        });

        console.log("✅ Sản phẩm liên quan (đã lọc):", filteredProducts);
      } catch (error) {
        console.log("❌ Lỗi:", error);
        toast.error(
          error.response?.data?.message || "Lỗi tải sản phẩm liên quan"
        );
      }
    };

    fetchProduct();
  }, [postData?.productType, id]);

  // Hàm xử lý khi click nút So sánh
  const handleOpenCompare = (productId) => {
    if (!isLogin) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng so sánh");
      return;
    }
    setSelectedProductToCompare(productId);
    setShowCompare(true);

    // Scroll đến phần Compare sau khi render
    setTimeout(() => {
      compareRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Hàm đóng Compare
  const handleCloseCompare = () => {
    setShowCompare(false);
    setSelectedProductToCompare(null);
  };

  const images = postData?.images || [];
  const isTrusted = postData?.trusted;

  const renderInfoItem = (label, value) => {
    if (!value && value !== 0) {
      return null;
    }
    let displayValue = value;
    if (label === "Màu sắc" && typeof value === "string") {
      displayValue = (
        <Tag
          color={value.toLowerCase()}
          className="font-medium text-base !text-black"
        >
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

  const ModernLoading = () => (
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

      <main className="max-w-[1200px] mx-auto px-2 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* === CỘT BÊN TRÁI === */}
          <div className="lg:col-span-2 space-y-1">
            {/* Carousel hình ảnh */}
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

            {/* Card Thông tin chi tiết */}
            <Card bordered={false} className="shadow-2xl rounded-xl p-4">
              <Title
                level={4}
                className="mb-6 border-b pb-3 flex items-center text-gray-800"
              >
                Thông tin chi tiết sản phẩm
              </Title>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 p-4">
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

                {renderInfoItem(
                  "Ngày đăng",
                  postData.postDate
                    ? new Date(postData.postDate).toLocaleDateString("vi-VN")
                    : null
                )}

                <div className="sm:col-span-2 lg:col-span-2">
                  {renderInfoItem("Địa chỉ", postData.user.address)}
                </div>
              </div>

              <Divider className="my-8" />

              <Title level={4} className="mb-4 flex items-center text-gray-800">
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

          {/* === CỘT BÊN PHẢI === */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card Giá & Nút hành động */}
            <Card bordered={false} className="shadow-2xl rounded-xl p-6 !mb-2">
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
              </Space>

              <div className="bg-green-50 p-5 rounded-xl border-l-4 border-green-600 my-5 flex items-baseline justify-between">
                <div>
                  <Text type="secondary" className="block text-lg mb-1">
                    Giá bán:
                  </Text>
                  <Text
                    strong
                    style={{ fontSize: "30px", color: "#259446d8" }}
                    className="font-extrabold"
                  >
                    {postData.price && typeof postData.price === "number"
                      ? postData.price.toLocaleString("vi-VN")
                      : "Liên hệ"}{" "}
                    <span className="text-2xl">VNĐ</span>
                  </Text>
                </div>
              </div>

              <Divider className="my-6" />

              <Space size="large" className="mt-4 flex flex-wrap">
                {isLogin ? (
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    style={{
                      height: "58px",
                      fontSize: "19px",
                      padding: "0 45px",
                      background: "#33bd24c5",
                      borderColor: "#dededeff",
                      borderRadius: "10px",
                    }}
                    className="hover:bg-red-700 transition-colors shadow-lg"
                    onClick={() => navigate(`/payment/${postData.id}`)}
                  >
                    Đặt hàng ngay
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    style={{
                      height: "58px",
                      fontSize: "19px",
                      padding: "0 45px",
                      background: "#33bd24c5",
                      borderColor: "#dededeff",
                      borderRadius: "10px",
                    }}
                    className="hover:bg-red-700 transition-colors shadow-lg"
                    onClick={() => toast.error("Vui lòng đăng nhập")}
                  >
                    Đăng nhập để đặt hàng
                  </Button>
                )}
              </Space>
            </Card>

            {/* Card Thông tin người bán */}
            {postData.user && (
              <Card bordered={false} className="shadow-2xl rounded-xl p-4">
                <Title
                  level={4}
                  className="mb-4 flex items-center text-gray-800"
                >
                  Thông tin người bán
                </Title>

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
          {/* Card So sánh sản phẩm */}
          {showCompare && selectedProductToCompare && (
            <div ref={compareRef} className="mt-2 lg:col-span-3 ">
              <Card
                bordered={false}
                className="shadow-2xl rounded-xl p-4 mt-2 border-2 border-blue-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <Title level={4} className="mb-0 text-blue-600">
                    <SwapOutlined className="mr-2" />
                    So sánh sản phẩm
                  </Title>
                  <Button
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    onClick={handleCloseCompare}
                    className="hover:bg-red-50"
                  >
                    Đóng
                  </Button>
                </div>
                <Compare
                  postId1={id}
                  postId2={selectedProductToCompare}
                  onClose={handleCloseCompare}
                />
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Sản phẩm liên quan */}
      {replateProduct && replateProduct.data.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-2 py-2 mb-8">
          <Card bordered={false} className="shadow-2xl rounded-xl p-6">
            <Title level={4} className="mb-6 flex items-center text-gray-800">
              Sản phẩm liên quan
            </Title>

            {replateProduct.data.length < 3 ? (
              // Hiển thị dạng grid nếu ít hơn 3 sản phẩm
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {replateProduct.data.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/view-product/${product.id}`)
                      }
                    >
                      <div className="relative">
                        <img
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.title}
                          className="w-full h-48 object-cover"
                        />

                        {/* Container cho 2 nút - Nằm bên phải */}
                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                          {/* Nút So sánh */}
                          <button
                            className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCompare(product.id);
                            }}
                            title="So sánh sản phẩm"
                          >
                            <SwapOutlined className="text-blue-500 text-lg" />
                          </button>

                          {/* Nút Yêu thích */}
                          <button
                            className="p-2 bg-white rounded-full shadow-md hover:bg-green-50 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            title="Thêm vào yêu thích"
                          >
                            <FiHeart className="h-5 w-5 text-green-500" />
                          </button>
                        </div>

                        {/* Tag Nổi bật */}
                        {product.trusted && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                            Nổi bật
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-green-600 font-medium text-xl mb-2">
                          {product.price?.toLocaleString("vi-VN")} VNĐ
                        </p>

                        <div className="space-y-2 mb-4">
                          {product.productType === "VEHICLE" ? (
                            <>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Hãng xe: </span>
                                {product.vehicleBrand || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Model: </span>
                                {product.model || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Màu sắc: </span>
                                {product.color || "N/A"}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Loại: </span>
                                {product.batteryType || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">
                                  Thương hiệu:{" "}
                                </span>
                                {product.batteryBrand || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">
                                  Dung lượng:{" "}
                                </span>
                                {product.capacity
                                  ? `${product.capacity} Ah`
                                  : "N/A"}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Hiển thị Carousel nếu >= 3 sản phẩm
              <Carousel
                arrows
                dots={true}
                infinite={true}
                className="related-products-carousel"
              >
                {Array.from({
                  length: Math.ceil(replateProduct.data.length / 4),
                }).map((_, slideIndex) => (
                  <div key={slideIndex}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                      {replateProduct.data
                        .slice(slideIndex * 4, (slideIndex + 1) * 4)
                        .map((product) => (
                          <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                          >
                            <div
                              className="cursor-pointer"
                              onClick={() =>
                                (window.location.href = `/view-product/${product.id}`)
                              }
                            >
                              <div className="relative">
                                <img
                                  src={
                                    product.images?.[0] || "/placeholder.png"
                                  }
                                  alt={product.title}
                                  className="w-full h-48 object-cover"
                                />

                                {/* Container cho 2 nút - Nằm bên phải */}
                                <div className="absolute top-2 right-2 flex gap-2 z-10">
                                  {/* Nút So sánh */}
                                  <button
                                    className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenCompare(product.id);
                                    }}
                                    title="So sánh sản phẩm"
                                  >
                                    <SwapOutlined className="text-blue-500 text-lg" />
                                  </button>

                                  {/* Nút Yêu thích */}
                                  <button
                                    className="p-2 bg-white rounded-full shadow-md hover:bg-green-50 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                    title="Thêm vào yêu thích"
                                  >
                                    <FiHeart className="h-5 w-5 text-green-500" />
                                  </button>
                                </div>

                                {/* Tag Nổi bật */}
                                {product.trusted && (
                                  <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm">
                                    Nổi bật
                                  </span>
                                )}
                              </div>

                              <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                  {product.title}
                                </h3>
                                <p className="text-green-600 font-medium text-xl mb-2">
                                  {product.price?.toLocaleString("vi-VN")} VNĐ
                                </p>

                                <div className="space-y-2 mb-4">
                                  {product.productType === "VEHICLE" ? (
                                    <>
                                      <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                          Hãng xe:{" "}
                                        </span>
                                        {product.vehicleBrand || "N/A"}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                          Model:{" "}
                                        </span>
                                        {product.model || "N/A"}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                          Màu sắc:{" "}
                                        </span>
                                        {product.color || "N/A"}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                          Loại:{" "}
                                        </span>
                                        {product.batteryType || "N/A"}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                          Thương hiệu:{" "}
                                        </span>
                                        {product.batteryBrand || "N/A"}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        <span className="font-medium">
                                          Dung lượng:{" "}
                                        </span>
                                        {product.capacity
                                          ? `${product.capacity} Ah`
                                          : "N/A"}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </Carousel>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default ViewProduct;
