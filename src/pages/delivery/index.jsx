import React, { useState, useEffect } from "react";
import {
  Card,
  Timeline,
  Descriptions,
  Tag,
  Spin,
  Button,
  Space,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import Header from "../../components/header";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";

const OrderDelivery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch thông tin delivery
  const fetchDelivery = async () => {
    try {
      const response = await api.get(`/buyer/order-deliveries/${id}`);
      setDelivery(response.data.data);
      console.log("✅ Delivery:", response.data.data);
      return response.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể tải thông tin giao hàng"
      );
      throw error;
    }
  };

  // ✅ Fetch thông tin đơn hàng
  const fetchOrder = async (orderId) => {
    try {
      const response = await api.get(`/buyer/orders/${orderId}`);
      setOrder(response.data.data);
      console.log("✅ Order:", response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể tải thông tin đơn hàng"
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const deliveryData = await fetchDelivery();
        if (deliveryData && deliveryData.orderId) {
          await fetchOrder(deliveryData.orderId);
        }
      } catch (error) {
        console.error("❌ Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // ✅ Map trạng thái giao hàng
  const getDeliveryStatusConfig = (status) => {
    const statusMap = {
      PREPARING: {
        text: "Đang chuẩn bị",
        color: "orange",
        icon: <ClockCircleOutlined />,
      },
      READY: {
        text: "Sẵn sàng",
        color: "blue",
        icon: <CheckCircleOutlined />,
      },
      DELIVERING: {
        text: "Đang giao",
        color: "processing",
        icon: <TruckOutlined />,
      },
      PICKUP_PENDING: {
        text: "Chờ lấy hàng",
        color: "gold",
        icon: <HomeOutlined />,
      },
      DELIVERED: {
        text: "Đã giao",
        color: "green",
        icon: <CheckCircleOutlined />,
      },
      RECEIVED: {
        text: "Đã nhận",
        color: "success",
        icon: <CheckCircleOutlined />,
      },
    };
    return statusMap[status] || { text: status, color: "default" };
  };

  // ✅ Tạo timeline items
  const getTimelineItems = () => {
    const statuses = [
      "PREPARING",
      "READY",
      "DELIVERING",
      "PICKUP_PENDING",
      "DELIVERED",
      "RECEIVED",
    ];

    const currentStatusIndex = statuses.indexOf(delivery?.status);

    return statuses.map((status, index) => {
      const config = getDeliveryStatusConfig(status);
      const isPassed = index <= currentStatusIndex;
      const isCurrent = index === currentStatusIndex;

      return {
        dot: isPassed ? (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: isCurrent ? config.color : "#52c41a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 16,
            }}
          >
            {config.icon}
          </div>
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#d9d9d9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#8c8c8c",
              fontSize: 16,
            }}
          >
            {config.icon}
          </div>
        ),
        color: isPassed ? (isCurrent ? config.color : "green") : "gray",
        children: (
          <div>
            <div
              style={{
                fontWeight: isCurrent ? "bold" : "normal",
                fontSize: isCurrent ? 16 : 14,
                marginBottom: 4,
              }}
            >
              {config.text}
            </div>
            {isCurrent && (
              <Tag color={config.color} style={{ marginTop: 4 }}>
                Trạng thái hiện tại
              </Tag>
            )}
          </div>
        ),
      };
    });
  };

  const getDeliveryMethod = (method) => {
    const deliveryMap = {
      GHN: "Giao hàng nhanh",
      SELLER_DELIVERY: "Người bán giao",
      BUYER_PICKUP: "Tự đến lấy",
    };
    return deliveryMap[method] || method;
  };

  const getPaymentType = (type) => {
    const paymentMap = {
      DEPOSIT: "Đặt cọc",
      FULL: "Thanh toán toàn bộ",
      COD: "Thanh toán khi nhận hàng",
    };
    return paymentMap[type] || type;
  };

  const getOrderStatusConfig = (status) => {
    const statusMap = {
      PENDING: { text: "Chờ xác nhận", color: "orange" },
      REJECTED: { text: "Đã từ chối", color: "red" },
      APPROVED: { text: "Đã xác nhận", color: "blue" },
      DONE: { text: "Hoàn thành", color: "green" },
      DEPOSITED: { text: "Đã đặt cọc", color: "cyan" },
    };
    return statusMap[status] || { text: status, color: "default" };
  };

  if (loading) {
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
        <div
          className="flex justify-center items-center"
          style={{ minHeight: "80vh" }}
        >
          <Spin size="large" tip="Đang tải thông tin giao hàng..." />
        </div>
      </div>
    );
  }

  if (!delivery || !order) {
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
            <p>Không tìm thấy thông tin giao hàng</p>
            <Button type="primary" onClick={() => navigate("/orders")}>
              Quay lại đơn hàng
            </Button>
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
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Header Card */}
          <Card
            bordered={false}
            className="shadow-2xl rounded-xl"
            title={
              <div className="flex items-center gap-3">
                <TruckOutlined className="text-2xl text-blue-600" />
                <span className="text-2xl font-bold">
                  Theo dõi giao hàng #{delivery.id}
                </span>
              </div>
            }
            extra={
              <Button type="default" onClick={() => navigate("/orders")}>
                Quay lại
              </Button>
            }
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã vận đơn" span={2}>
                <span className="font-bold text-blue-600">
                  {delivery.deliveryTrackingNumber}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Đơn vị vận chuyển">
                <Tag color="blue">{delivery.deliveryProvider}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày giao dự kiến">
                <ClockCircleOutlined className="mr-2" />
                {new Date(delivery.deliveryDate).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái hiện tại" span={2}>
                <Tag color={getDeliveryStatusConfig(delivery.status).color}>
                  {getDeliveryStatusConfig(delivery.status).text}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Timeline Card */}
          <Card
            bordered={false}
            className="shadow-2xl rounded-xl"
            title={
              <div className="flex items-center gap-3">
                <EnvironmentOutlined className="text-2xl text-green-600" />
                <span className="text-xl font-bold">Lộ trình giao hàng</span>
              </div>
            }
          >
            <Timeline
              mode="left"
              items={getTimelineItems()}
              style={{ paddingTop: 20 }}
            />
          </Card>

          {/* Order Details Card */}
          <Card
            bordered={false}
            className="shadow-2xl rounded-xl"
            title={
              <div className="flex items-center gap-3">
                <ShoppingCartOutlined className="text-2xl text-orange-600" />
                <span className="text-xl font-bold">
                  Thông tin đơn hàng #{order.id}
                </span>
              </div>
            }
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Loại sản phẩm" span={2}>
                <Tag color="blue">
                  {order.productType === "VEHICLE" ? "Xe cộ" : "Ắc quy/Pin"}
                </Tag>
              </Descriptions.Item>

              {order.vehicleBrand && (
                <>
                  <Descriptions.Item label="Hãng xe">
                    {order.vehicleBrand}
                  </Descriptions.Item>
                  <Descriptions.Item label="Model">
                    {order.model}
                  </Descriptions.Item>
                </>
              )}

              {order.batteryBrand && (
                <>
                  <Descriptions.Item label="Hãng ắc quy">
                    {order.batteryBrand}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại ắc quy">
                    {order.batteryType}
                  </Descriptions.Item>
                </>
              )}

              <Descriptions.Item label="Giá sản phẩm">
                <span className="font-semibold text-blue-600">
                  {order.price?.toLocaleString("vi-VN")} VNĐ
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Phí vận chuyển">
                <span className="font-semibold text-orange-600">
                  {order.shippingFee?.toLocaleString("vi-VN")} VNĐ
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Phương thức giao hàng" span={2}>
                <Tag color="blue" icon={<TruckOutlined />}>
                  {getDeliveryMethod(order.deliveryMethod)}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Hình thức thanh toán" span={2}>
                <Tag color={order.paymentType === "FULL" ? "green" : "gold"}>
                  <DollarOutlined /> {getPaymentType(order.paymentType)}
                </Tag>
              </Descriptions.Item>

              {order.paymentType === "DEPOSIT" && (
                <>
                  <Descriptions.Item label="Phần trăm đặt cọc">
                    {order.depositPercentage}%
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái đặt cọc">
                    {order.depositPaid ? (
                      <Tag color="green" icon={<CheckCircleOutlined />}>
                        Đã đặt cọc
                      </Tag>
                    ) : (
                      <Tag color="orange">Chưa đặt cọc</Tag>
                    )}
                  </Descriptions.Item>
                </>
              )}

              <Descriptions.Item label="Trạng thái đơn hàng" span={2}>
                <Tag color={getOrderStatusConfig(order.status).color}>
                  {getOrderStatusConfig(order.status).text}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày đặt hàng" span={2}>
                <ClockCircleOutlined className="mr-2" />
                {new Date(order.createdAt).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Descriptions.Item>

              <Descriptions.Item label="Tổng thanh toán" span={2}>
                <div className="text-2xl font-bold text-green-600">
                  {(order.price + order.shippingFee).toLocaleString("vi-VN")}{" "}
                  VNĐ
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default OrderDelivery;
