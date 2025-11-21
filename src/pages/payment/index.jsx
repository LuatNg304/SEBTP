import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Radio,
  Space,
  Button,
  Divider,
  Tag,
  Skeleton,
  Alert,
  Form,
  Input,
  Spin,
} from "antd";
import {
  ShoppingOutlined,
  TruckOutlined,
  WalletOutlined,
  CarOutlined,
  HomeOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [wantDeposit, setWantDeposit] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);
  const [loadingShippingFee, setLoadingShippingFee] = useState(false);
  const [depositPercentage, setDepositPercentage] = useState(null);

  // ✅ Fetch deposit percentage on component mount
  useEffect(() => {
    const fetchDepositPercentage = async () => {
      try {
        const response = await api.get("/user/deposit-percentage");
        setDepositPercentage(response.data.data * 100);
        console.log("✅ Deposit percentage:", response.data.data);
      } catch (error) {
        console.log("❌ Error fetching deposit percentage:", error);
        toast.error(
          error.response?.data?.message || "Không thể tải thông tin đặt cọc"
        );
      }
    };
    fetchDepositPercentage();
  }, []);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/public/posts/post-detail?postId=${id}`
        );
        setProduct(response.data.data);
        console.log("✅ Product data:", response.data.data);
      } catch (error) {
        console.log("❌ Lỗi load sản phẩm:", error);
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch service types khi chọn GHN
  useEffect(() => {
    const fetchServiceTypes = async () => {
      if (selectedDelivery === "GHN") {
        try {
          const response = await api.post("/ghn/buyer/available-services", {
            postId: parseInt(id),
          });
          setServiceTypes(response.data);
          console.log("✅ Service types:", response.data);

          if (response.data && response.data.length > 0) {
            setSelectedService(response.data[0].service_type_id);
          }
        } catch (error) {
          if (
            error.response?.data?.message === "Người mua chưa cập nhật địa chỉ"
          ) {
            toast.error(error.response.data.message);
            setTimeout(() => {
              navigate("/view-profile");
            }, 1000);
            return;
          }
          console.log("❌ Lỗi load service types:", error);
          toast.error("Không thể tải dịch vụ giao hàng");
        }
      } else {
        setServiceTypes([]);
        setSelectedService(null);
        setShippingFee(null);
      }
    };
    fetchServiceTypes();
  }, [selectedDelivery, id, navigate]);

  // Fetch shipping fee khi đã có service type
  useEffect(() => {
    const fetchShippingFee = async () => {
      if (selectedDelivery === "GHN" && selectedService) {
        try {
          setLoadingShippingFee(true);
          const response = await api.post("/ghn/buyer/shipping-fee", {
            postId: parseInt(id),
            serviceTypeId: selectedService,
          });
          setShippingFee(response.data);
          console.log("✅ Shipping fee:", response.data);
        } catch (error) {
          console.log("❌ Lỗi load phí ship:", error);
          toast.error("Không thể tính phí giao hàng");
        } finally {
          setLoadingShippingFee(false);
        }
      }
    };
    fetchShippingFee();
  }, [selectedDelivery, selectedService, id]);

  // Handle submit order
  const handleSubmitOrder = async () => {
    try {
      setSubmitting(true);

      const postId = parseInt(id);
      if (!postId || isNaN(postId)) {
        toast.error("ID sản phẩm không hợp lệ");
        return;
      }
      if (!selectedDelivery) {
        toast.error("Vui lòng chọn phương thức giao hàng");
        return;
      }

      const params = {
        postId: postId,
        deliveryMethod: selectedDelivery,
        paymentType: "PLATFORM",
        wantDeposit: wantDeposit,
      };

      if (selectedDelivery === "GHN" && selectedService) {
        params.serviceTypeId = parseInt(selectedService);
      }

      console.log("📦 Order params:", params);

      const response = await api.post("/buyer/orders/create",   params );
      console.log("✅ Order created:", response.data);

      toast.success("Đặt hàng thành công!");
      navigate("/orders");
    } catch (error) {
      if (error.response?.data?.message === "Wallet has no balance") {
        navigate("/user/wallet");
        toast.error(error.response.data.message);
        return;
      }
      console.error("❌ Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Không thể tạo đơn hàng");
    } finally {
      setSubmitting(false);
    }
  };

  // Delivery method options
  const allDeliveryOptions = [
    {
      value: "SELLER_DELIVERY",
      label: "Người bán giao hàng",
      icon: <CarOutlined />,
      description: "Người bán sẽ tự giao hàng đến địa chỉ của bạn",
    },
    {
      value: "GHN",
      label: "Giao hàng nhanh (GHN)",
      icon: <TruckOutlined />,
      description: "Giao hàng qua đơn vị vận chuyển GHN",
    },
    {
      value: "BUYER_PICKUP",
      label: "Tự đến lấy",
      icon: <HomeOutlined />,
      description: "Bạn tự đến địa chỉ người bán để nhận hàng",
    },
  ];

  const availableDeliveryOptions = allDeliveryOptions.filter((option) =>
    product?.deliveryMethods?.includes(option.value)
  );

  // ✅ Payment options - sử dụng depositPercentage từ state
  const paymentOptions = depositPercentage
    ? [
        {
          value: false,
          label: "Thanh toán toàn bộ khi nhận hàng",
          icon: <WalletOutlined />,
          description: "Thanh toán đầy đủ 100% khi nhận hàng",
        },
        {
          value: true,
          label: "Đặt cọc trước",
          icon: <WalletOutlined />,
          description: `Đặt cọc ${depositPercentage}% trước, thanh toán phần còn lại khi nhận hàng`,
        },
      ]
    : [];

  // ✅ Tính tiền đặt cọc
  const calculateDepositAmount = () => {
    if (!product || !depositPercentage) return 0;
    const productPrice = product.price || 0;
    return (productPrice * depositPercentage) / 100;
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    if (!product) return 0;
    const productPrice = product.price || 0;
    const shipping =
      selectedDelivery === "GHN" && shippingFee ? shippingFee.total : 0;
    return productPrice + shipping;
  };

  // ✅ Show loading nếu chưa có depositPercentage hoặc product
  if (loading || !product || depositPercentage === null) {
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
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <Card>
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        </div>
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

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Order Form */}
          <div className="lg:col-span-2">
            <Card bordered={false} className="shadow-2xl rounded-xl">
              <Title level={3} className="mb-6 flex items-center">
                <ShoppingOutlined className="mr-3 text-blue-600" />
                Thông tin đặt hàng
              </Title>

              <Form form={form} layout="vertical">
                {/* Phương thức giao hàng */}
                <Form.Item
                  label={
                    <Text strong className="text-lg">
                      Phương thức giao hàng
                    </Text>
                  }
                  required
                >
                  {availableDeliveryOptions.length > 0 ? (
                    <Radio.Group
                      value={selectedDelivery}
                      onChange={(e) => setSelectedDelivery(e.target.value)}
                      className="w-full"
                    >
                      <Space
                        direction="vertical"
                        className="w-full"
                        size="middle"
                      >
                        {availableDeliveryOptions.map((option) => (
                          <Card
                            key={option.value}
                            className={`cursor-pointer transition-all ${
                              selectedDelivery === option.value
                                ? "border-2 border-blue-500 bg-blue-50"
                                : "border hover:border-blue-300"
                            }`}
                            onClick={() => setSelectedDelivery(option.value)}
                          >
                            <Radio value={option.value} className="w-full">
                              <div className="ml-2">
                                <div className="flex items-center gap-2 mb-1">
                                  {option.icon}
                                  <Text strong className="text-base">
                                    {option.label}
                                  </Text>
                                </div>
                                <Text type="secondary" className="text-sm">
                                  {option.description}
                                </Text>
                              </div>
                            </Radio>
                          </Card>
                        ))}
                      </Space>
                    </Radio.Group>
                  ) : (
                    <Alert
                      message="Không có phương thức giao hàng"
                      description="Sản phẩm này không có phương thức giao hàng nào."
                      type="warning"
                      showIcon
                    />
                  )}
                </Form.Item>

                {/* Service Type cho GHN */}
                {selectedDelivery === "GHN" && serviceTypes.length > 0 && (
                  <Form.Item
                    label={
                      <Text strong className="text-lg">
                        Loại dịch vụ giao hàng
                      </Text>
                    }
                  >
                    <Input
                      size="large"
                      value={serviceTypes[0]?.short_name || ""}
                      readOnly
                      className="bg-gray-50"
                    />
                  </Form.Item>
                )}

                <Divider />

                {/* Hình thức thanh toán */}
                <Form.Item
                  label={
                    <Text strong className="text-lg">
                      Hình thức thanh toán
                    </Text>
                  }
                  required
                >
                  <Radio.Group
                    value={wantDeposit}
                    onChange={(e) => setWantDeposit(e.target.value)}
                    className="w-full"
                  >
                    <Space
                      direction="vertical"
                      className="w-full"
                      size="middle"
                    >
                      {paymentOptions.map((option) => (
                        <Card
                          key={option.value.toString()}
                          className={`cursor-pointer transition-all ${
                            wantDeposit === option.value
                              ? "border-2 border-green-500 bg-green-50"
                              : "border hover:border-green-300"
                          }`}
                          onClick={() => setWantDeposit(option.value)}
                        >
                          <Radio value={option.value} className="w-full">
                            <div className="ml-2">
                              <div className="flex items-center gap-2 mb-1">
                                {option.icon}
                                <Text strong className="text-base">
                                  {option.label}
                                </Text>
                              </div>
                              <Text type="secondary" className="text-sm">
                                {option.description}
                              </Text>
                            </div>
                          </Radio>
                        </Card>
                      ))}
                    </Space>
                  </Radio.Group>
                </Form.Item>

                {/* Alert info */}
                {wantDeposit && (
                  <Alert
                    message="Lưu ý về đặt cọc"
                    description={`Bạn cần thanh toán ${depositPercentage}% giá sản phẩm (${calculateDepositAmount().toLocaleString(
                      "vi-VN"
                    )} VNĐ). Phần còn lại và phí giao hàng sẽ thanh toán khi nhận hàng.`}
                    type="info"
                    showIcon
                    className="mb-4"
                  />
                )}

                <Divider />

                {/* SUMMARY CARD */}
                <Card
                  className="mb-6"
                  style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <DollarOutlined
                      className="text-xl"
                      style={{ color: "#259446d8" }}
                    />
                    <Text strong className="text-lg">
                      Chi tiết thanh toán
                    </Text>
                  </div>

                  <div className="space-y-3">
                    {/* Giá sản phẩm */}
                    <div className="flex justify-between items-center">
                      <Text className="text-base">Giá sản phẩm:</Text>
                      <Text strong className="text-base">
                        {product.price?.toLocaleString("vi-VN")} VNĐ
                      </Text>
                    </div>

                    {/* Phí GHN */}
                    {selectedDelivery === "GHN" && (
                      <>
                        {loadingShippingFee ? (
                          <div className="flex justify-between items-center">
                            <Text className="text-base">Đang tính phí...</Text>
                            <Spin size="small" />
                          </div>
                        ) : (
                          shippingFee && (
                            <>
                              <div className="flex justify-between items-center">
                                <Text className="text-base">
                                  Phí vận chuyển:
                                </Text>
                                <Text strong className="text-base">
                                  {shippingFee.service_fee?.toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  VNĐ
                                </Text>
                              </div>
                              <div className="flex justify-between items-center">
                                <Text className="text-base">Phí bảo hiểm:</Text>
                                <Text strong className="text-base">
                                  {shippingFee.insurance_fee?.toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  VNĐ
                                </Text>
                              </div>
                            </>
                          )
                        )}
                      </>
                    )}

                    <Divider style={{ margin: "12px 0" }} />

                    {/* Tổng cộng */}
                    <div className="flex justify-between items-center">
                      <Text
                        strong
                        className="text-lg"
                        style={{ color: "#259446d8" }}
                      >
                        Tổng thanh toán:
                      </Text>
                      <Text
                        strong
                        className="text-2xl"
                        style={{ color: "#259446d8" }}
                      >
                        {calculateTotal().toLocaleString("vi-VN")} VNĐ
                      </Text>
                    </div>

                    {/* Hiển thị số tiền đặt cọc */}
                    {wantDeposit && (
                      <>
                        <Divider style={{ margin: "12px 0" }} />
                        <div className="flex justify-between items-center bg-yellow-50 p-3 rounded">
                          <Text strong className="text-base">
                            Số tiền cần đặt cọc ({depositPercentage}% giá SP):
                          </Text>
                          <Text
                            strong
                            className="text-xl"
                            style={{ color: "#fa8c16" }}
                          >
                            {calculateDepositAmount().toLocaleString("vi-VN")}{" "}
                            VNĐ
                          </Text>
                        </div>
                        <div className="flex justify-between items-center">
                          <Text type="secondary" className="text-sm">
                            (Phí giao hàng thanh toán khi nhận)
                          </Text>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Submit button */}
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={submitting}
                  onClick={handleSubmitOrder}
                  disabled={
                    !selectedDelivery || availableDeliveryOptions.length === 0
                  }
                  className="h-14 text-lg font-semibold"
                  style={{ background: "#33bd24c5" }}
                >
                  Xác nhận đặt hàng
                </Button>
              </Form>
            </Card>
          </div>

          {/* RIGHT COLUMN - Product Summary */}
          <div className="lg:col-span-1">
            <Card
              bordered={false}
              className="shadow-2xl rounded-xl sticky top-4"
            >
              <Title level={4} className="mb-4">
                Thông tin sản phẩm
              </Title>

              {/* Product image */}
              {product.images?.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              {/* Product info */}
              <Title level={5} className="mb-2 line-clamp-2">
                {product.title}
              </Title>

              <Space wrap className="mb-4">
                <Tag color="blue">
                  {product.productType === "VEHICLE" ? "Xe cộ" : "Ắc quy/Pin"}
                </Tag>
                {product.trusted && <Tag color="green">Đã kiểm duyệt</Tag>}
              </Space>

              <Divider className="my-4" />

              {/* Price breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text type="secondary">Giá sản phẩm:</Text>
                  <Text strong className="text-base">
                    {product.price?.toLocaleString("vi-VN")} VNĐ
                  </Text>
                </div>

                {selectedDelivery === "GHN" && shippingFee && (
                  <div className="flex justify-between">
                    <Text type="secondary">Phí giao hàng:</Text>
                    <Text
                      strong
                      className="text-base"
                      style={{ color: "#1890ff" }}
                    >
                      {shippingFee.total?.toLocaleString("vi-VN")} VNĐ
                    </Text>
                  </div>
                )}
              </div>

              <Divider className="my-4" />

              {/* Seller info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Text strong className="block mb-2">
                  Người bán
                </Text>
                <Text className="block text-sm">
                  {product.user?.storeName || product.user?.fullName}
                </Text>
                <Text type="secondary" className="block text-xs mt-1">
                  {product.user?.phone}
                </Text>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
