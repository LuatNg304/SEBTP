import React, { useState, useEffect } from "react";
import {
  Card,
  Steps,
  Descriptions,
  Tag,
  Spin,
  Button,
  Space,
  Alert,
  Divider,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
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
  const [invoices, setInvoices] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // ✅ Fetch thông tin delivery
  const fetchDelivery = async () => {
    try {
      const response = await api.get(`/buyer/order-deliveries/${id}`);
      setDelivery(response.data.data);
      console.log("Luat dep:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Delivery not found:", error.response?.status);
      return null;
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

  // ✅ Fetch invoices theo orderId
  const fetchInvoices = async (orderId) => {
    try {
      const response = await api.get(`/buyer/invoices/orders/${orderId}`);
      setInvoices(response.data.data);
      console.log("✅ Invoices:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("❌ Invoices error:", error);
      return [];
    }
  };

  // ✅ Thanh toán invoice (từ card invoice hoặc card đơn hàng)
  const handlePaymentInvoice = async (invoiceId) => {
    try {
      setPaymentLoading(true);
      const response = await api.post("/buyer/invoices/pay", {
        invoiceId: invoiceId,
        paymentMethod: "WALLET",
      });
      toast.success("Thanh toán thành công! Đang tải lại trang...");
      console.log("✅ Payment success:", response.data);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("❌ Payment error:", error);
      toast.error(error.response?.data?.message || "Thanh toán thất bại");
      setPaymentLoading(false);
    }
  };

  // ✅ Xử lý thanh toán từ card thông tin đơn hàng (khi PICKUP_PENDING)
  const handlePaymentFromOrderCard = async () => {
    try {
      setPaymentLoading(true);
      const invoicesList = await fetchInvoices(order.id);
      const activeInv = invoicesList.find((inv) => inv.status === "ACTIVE");

      if (!activeInv) {
        toast.error("Không tìm thấy hóa đơn chưa thanh toán");
        setPaymentLoading(false);
        return;
      }

      const response = await api.post("/buyer/invoices/pay", {
        invoiceId: activeInv.id,
        paymentMethod: "WALLET",
      });
      toast.success("Thanh toán thành công! Đang tải lại trang...");
      console.log("✅ Payment success:", response.data);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("❌ Payment error:", error);
      toast.error(error.response?.data?.message || "Thanh toán thất bại");
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const deliveryData = await fetchDelivery();

        if (deliveryData && deliveryData.orderId) {
          await fetchOrder(deliveryData.orderId);
          await fetchInvoices(deliveryData.orderId);
        } else {
          if (id) {
            await fetchOrder(id);
            const orderInfo = await api
              .get(`/buyer/orders/${id}`)
              .catch(() => null);
            if (orderInfo?.data?.data) {
              await fetchInvoices(id);
            }
          }
        }
      } catch (error) {
        console.error("❌ Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const getDeliveryStatusConfig = (status) => {
    const statusMap = {
      PREPARING: { text: "Đang chuẩn bị", color: "orange" },
      READY: { text: "Sẵn sàng", color: "blue" },
      DELIVERING: { text: "Đang giao", color: "processing" },
      PICKUP_PENDING: { text: "Chờ lấy hàng", color: "gold" },
      DELIVERED: { text: "Đã giao", color: "green" },
      RECEIVED: { text: "Đã nhận", color: "success" },
    };
    return statusMap[status] || { text: status, color: "default" };
  };

  const getStepsItems = () => {
    const statuses = [
      { key: "PREPARING", title: "Chuẩn bị" },
      { key: "READY", title: "Sẵn sàng" },
      { key: "DELIVERING", title: "Đang giao" },
      { key: "PICKUP_PENDING", title: "Chờ lấy" },
      { key: "DELIVERED", title: "Đã giao" },
      { key: "RECEIVED", title: "Đã nhận" },
    ];

    const currentStatusIndex = statuses.findIndex(
      (s) => s.key === delivery?.status
    );

    return statuses.map((status, index) => {
      const isCurrent = index === currentStatusIndex;
      return {
        title: (
          <span style={{ fontWeight: isCurrent ? "bold" : "normal" }}>
            {status.title}
          </span>
        ),
        status:
          index < currentStatusIndex
            ? "finish"
            : isCurrent
            ? "process"
            : "wait",
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
      CANCELED: { text: "Đã hủy", color: "volcano" },
    };
    return statusMap[status] || { text: status, color: "default" };
  };
  const handleConfirmOrder = async () => {
    try {
      const res = await api.post(`buyer/order-deliveries/${delivery.id}/confirm-received`);
      fetchDelivery();
      console.log("ID cua delivery: ", delivery.id);

      toast.success("Xác nhận giao hàng thành công!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Xác nhận giao hàng thất bại"
      );
    }
  };

  const activeInvoice = invoices.find((inv) => inv.status === "ACTIVE");
  const isPickupPending = delivery?.status === "PICKUP_PENDING";

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

      {loading ? (
        <div
          className="flex justify-center items-center"
          style={{ minHeight: "80vh" }}
        >
          <Spin size="large" tip="Đang tải thông tin giao hàng..." />
        </div>
      ) : !delivery && !activeInvoice && !order ? (
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <Card>
            <p>Không tìm thấy thông tin giao hàng hoặc hóa đơn</p>
            <Button type="primary" onClick={() => navigate("/orders")}>
              Quay lại đơn hàng
            </Button>
          </Card>
        </div>
      ) : (
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {order &&
              (order.status === "CANCELED" || order.status === "REJECTED") && (
                <Alert
                  message={
                    order.status === "CANCELED"
                      ? "Đơn hàng đã bị hủy"
                      : "Đơn hàng đã bị từ chối"
                  }
                  type="error"
                  icon={<CloseCircleOutlined />}
                  showIcon
                />
              )}

            {!delivery && activeInvoice && (
              <Alert
                message="Đơn hàng chưa được giao"
                description="Vui lòng thanh toán hóa đơn để tiếp tục xử lý đơn hàng."
                type="warning"
                icon={<ExclamationCircleOutlined />}
                showIcon
              />
            )}

            {delivery && (
              <Card
                bordered={false}
                className="shadow-2xl rounded-xl"
                title={
                  <div className="flex items-center gap-3">
                    <TruckOutlined className="text-2xl text-blue-600" />
                    <span className="text-2xl font-bold">
                      Theo dõi giao hàng #{delivery.orderId}
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
                  {delivery.deliveryTrackingNumber && (
                    <Descriptions.Item label="Mã vận đơn" span={2}>
                      <span className="font-bold text-blue-600">
                        {delivery.deliveryTrackingNumber}
                      </span>
                    </Descriptions.Item>
                  )}

                  {order && (
                    <Descriptions.Item label="Đơn vị vận chuyển">
                      <Tag color="blue">
                        {getDeliveryMethod(order.deliveryMethod)}
                      </Tag>
                    </Descriptions.Item>
                  )}

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

                {!(
                  order &&
                  (order.status === "CANCELED" || order.status === "REJECTED")
                ) && (
                  <>
                    <Divider orientation="left">
                      <div className="flex items-center gap-2">
                        <EnvironmentOutlined className="text-green-600" />
                        <span>Lộ trình giao hàng</span>
                      </div>
                    </Divider>

                    <style>
                      {`
                        .custom-steps .ant-steps-item-icon {
                          display: none !important;
                        }
                        .custom-steps .ant-steps-item-container {
                          padding-left: 0 !important;
                        }
                        .custom-steps .ant-steps-item-content {
                          min-height: auto !important;
                        }
                      `}
                    </style>

                    <Steps
                      className="custom-steps"
                      current={[
                        "PREPARING",
                        "READY",
                        "DELIVERING",
                        "PICKUP_PENDING",
                        "DELIVERED",
                        "RECEIVED",
                      ].indexOf(delivery?.status)}
                      items={getStepsItems()}
                      style={{ padding: "20px 0" }}
                    />
                  </>
                )}
              </Card>
            )}

            {!delivery && activeInvoice && (
              <Card
                bordered={false}
                className="shadow-2xl rounded-xl"
                title={
                  <div className="flex items-center gap-3">
                    <DollarOutlined className="text-2xl text-red-600" />
                    <span className="text-2xl font-bold">
                      Hóa đơn chưa thanh toán
                    </span>
                  </div>
                }
              >
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Số hóa đơn" span={2}>
                    <span className="font-bold text-blue-600">
                      {activeInvoice.invoiceNumber}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Số tiền">
                    <span className="font-semibold text-red-600 text-lg">
                      {Math.abs(activeInvoice.totalPrice).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VNĐ
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Trạng thái">
                    <Tag color="red">{activeInvoice.status}</Tag>
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày tạo" span={2}>
                    <ClockCircleOutlined className="mr-2" />
                    {new Date(activeInvoice.createdAt).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Descriptions.Item>

                  {activeInvoice.dueDate && (
                    <Descriptions.Item label="Hạn thanh toán" span={2}>
                      <ClockCircleOutlined className="mr-2" />
                      {new Date(activeInvoice.dueDate).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Descriptions.Item>
                  )}
                </Descriptions>

                <Space style={{ marginTop: "20px", width: "100%" }}>
                  <Button
                    type="primary"
                    size="large"
                    loading={paymentLoading}
                    onClick={() => handlePaymentInvoice(activeInvoice.id)}
                  >
                    Thanh toán ngay
                  </Button>
                  <Button type="default" onClick={() => navigate("/orders")}>
                    Quay lại
                  </Button>
                </Space>
              </Card>
            )}

            {order && (
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
                    <Tag
                      color={order.paymentType === "FULL" ? "green" : "gold"}
                    >
                      <DollarOutlined /> {getPaymentType(order.paymentType)}
                    </Tag>
                  </Descriptions.Item>

                  {order.paymentType === "DEPOSIT" &&
                    order.depositPercentage && (
                      <>
                        <Descriptions.Item label="Phần trăm đặt cọc">
                          {order.depositPercentage}%
                        </Descriptions.Item>
                        <Descriptions.Item label="Số tiền đặt cọc">
                          <span className="font-semibold text-cyan-600">
                            {(
                              (order.price * order.depositPercentage) /
                              100
                            ).toLocaleString("vi-VN")}{" "}
                            VNĐ
                          </span>
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
                      {(order.price + order.shippingFee).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VNĐ
                    </div>
                  </Descriptions.Item>
                </Descriptions>

                {isPickupPending && activeInvoice && (
                  <Space style={{ marginTop: "20px", width: "100%" }}>
                    <Alert
                      message="Vui lòng thanh toán phần còn lại"
                      description={`Số tiền: ${Math.abs(
                        activeInvoice.totalPrice
                      ).toLocaleString("vi-VN")} VNĐ`}
                      type="info"
                      style={{ width: "100%" }}
                    />
                  </Space>
                )}

                {isPickupPending && activeInvoice && (
                  <Space style={{ marginTop: "15px", width: "100%" }}>
                    <Button
                      type="primary"
                      size="large"
                      loading={paymentLoading}
                      onClick={handlePaymentFromOrderCard}
                    >
                      Thanh toán phần còn lại
                    </Button>
                    <Button type="default" onClick={() => navigate("/orders")}>
                      Quay lại
                    </Button>
                  </Space>
                )}
              </Card>
            )}
          </Space>
          <Divider />
          {delivery?.status === "DELIVERED" && (
            <div className="text-center">
              <Button
                type="primary"
                size="large"
                loading={paymentLoading}
                onClick={handleConfirmOrder}
              >
                Xác nhận giao hàng
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDelivery;
