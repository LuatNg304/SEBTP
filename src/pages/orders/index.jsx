import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  Space,
  Empty,
  Spin,
  Card,
  Input,
  Form,
} from "antd";
import {
  ShoppingCartOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  DollarOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import api from "../../config/axios";
import { toast } from "react-toastify";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const Orders = () => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelForm] = Form.useForm();
  const [contractList, setContractList] = useState([]);
  const [deliveryList, setDeliveryList] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch danh sách delivery
  const fetchDeliveries = async () => {
    try {
      const response = await api.get("/buyer/order-deliveries");
      setDeliveryList(response.data.data || []);
      console.log("✅ Deliveries:", response.data.data);
    } catch (error) {
      console.error("❌ Error fetching deliveries:", error);
    }
  };

  // ✅ Fetch danh sách hợp đồng
  const fetchContracts = async () => {
    try {
      const response = await api.get("/buyer/contracts");
      setContractList(response.data.data || []);
      console.log("✅ Contracts:", response.data.data);
    } catch (error) {
      console.error("❌ Error fetching contracts:", error);
    }
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get("/buyer/orders");

      const sortedOrders = (response.data.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrderList(sortedOrders);
      console.log("✅ Orders:", sortedOrders);
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(
        error.response?.data?.message || "Không thể tải danh sách đơn hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    fetchContracts();
    fetchDeliveries();
  }, []);

  // ✅ Hàm kiểm tra đơn hàng có hợp đồng không
  const hasContract = (orderId) => {
    return contractList.some((contract) => contract.orderId === orderId);
  };

  // ✅ Hàm lấy contract ID từ orderId
  const getContractId = (orderId) => {
    const contract = contractList.find((c) => c.orderId === orderId);
    return contract?.id;
  };

  // ✅ Hàm lấy delivery ID từ orderId
  const getDeliveryId = (orderId) => {
    const delivery = deliveryList.find((d) => d.orderId === orderId.toString());
    return delivery?.orderId;
  };

  // ✅ Hàm xử lý click nút Chi tiết
  const handleViewDetail = (orderId) => {
    

    navigate(`/delivery/${orderId}`);
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      PENDING: { text: "Chờ xác nhận", color: "orange" },
      REJECTED: { text: "Đã từ chối", color: "red" },
      APPROVED: { text: "Đã xác nhận", color: "blue" },
      DONE: { text: "Hoàn thành", color: "green" },
      DEPOSITED: { text: "Đã đặt cọc", color: "cyan" },
    };
    return statusMap[status] || { text: status, color: "default" };
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

  const showOrderDetail = (record) => {
    setSelectedOrder(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const showCancelModal = (record) => {
    setSelectedOrder(record);
    setIsCancelModalVisible(true);
    cancelForm.resetFields();
  };

  const handleCancelModalClose = () => {
    setIsCancelModalVisible(false);
    setSelectedOrder(null);
    cancelForm.resetFields();
  };

  const handleCancelOrder = async () => {
    try {
      const values = await cancelForm.validateFields();
      setCancelLoading(true);

      await api.patch("/buyer/orders/cancel", {
        orderId: selectedOrder.id,
        reason: values.reason,
      });

      toast.success("Hủy đơn hàng thành công!");
      setIsCancelModalVisible(false);
      cancelForm.resetFields();

      await fetchOrder();
    } catch (error) {
      if (error.errorFields) {
        toast.error("Vui lòng nhập lý do hủy đơn!");
      } else {
        console.error("❌ Error:", error);
        toast.error(error.response?.data?.message || "Không thể hủy đơn hàng");
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 100,
      sorter: (a, b) => a.id - b.id,
      render: (id) => (
        <a onClick={() => showOrderDetail(orderList.find((o) => o.id === id))}>
          #{id}
        </a>
      ),
    },
    {
      title: "Sản phẩm",
      key: "product",
      width: 250,
      sorter: (a, b) => {
        const nameA = a.vehicleBrand || a.batteryBrand || "";
        const nameB = b.vehicleBrand || b.batteryBrand || "";
        return nameA.localeCompare(nameB);
      },
      render: (_, record) => (
        <div>
          <div className="font-semibold">
            {record.productType === "VEHICLE" ? "Xe cộ" : "Ắc quy/Pin"}
          </div>
          {record.vehicleBrand && (
            <div className="text-sm text-gray-600">
              {record.vehicleBrand} {record.model}
            </div>
          )}
          {record.batteryBrand && (
            <div className="text-sm text-gray-600">
              {record.batteryBrand} - {record.batteryType}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      key: "total",
      width: 150,
      sorter: (a, b) => a.price + a.shippingFee - (b.price + b.shippingFee),
      render: (_, record) => {
        const total = record.price + record.shippingFee;
        return (
          <span className="font-bold text-green-600">
            {total.toLocaleString("vi-VN")} VNĐ
          </span>
        );
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
      render: (date) => (
        <div className="text-sm">
          <ClockCircleOutlined className="mr-2 text-gray-500" />
          {new Date(date).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      sorter: (a, b) => {
        const statusOrder = {
          PENDING: 1,
          REJECTED: 2,
          APPROVED: 3,
          DEPOSITED: 4,
          DONE: 5,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      },
      filters: [
        { text: "Chờ xác nhận", value: "PENDING" },
        { text: "Đã từ chối", value: "REJECTED" },
        { text: "Đã xác nhận", value: "APPROVED" },
        { text: "Đã đặt cọc", value: "DEPOSITED" },
        { text: "Hoàn thành", value: "DONE" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          >
            Tình trạng giao hàng
          </Button>

          {hasContract(record.id) && (
            <Button
              type="default"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => navigate(`/contract/${getContractId(record.id)}`)}
            >
              Hợp đồng
            </Button>
          )}

          {(record.status === "PENDING" ||
            record.status === "APPROVED" ||
            record.status === "DEPOSITED") && (
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => showCancelModal(record)}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

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
          <Spin size="large" tip="Đang tải đơn hàng..." />
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

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <Card
          bordered={false}
          className="shadow-2xl rounded-xl"
          title={
            <div className="flex items-center gap-3">
              {/* <ShoppingCartOutlined className="text-2xl text-blue-600" /> */}
              <span className="text-2xl ">Đơn hàng của tôi</span>
              <Tag color="blue" className="ml-2">
                {orderList.length} đơn hàng
              </Tag>
            </div>
          }
          extra={
            <Button
              type="default"
              icon={<ShoppingCartOutlined />}
              onClick={() => navigate("/")}
            >
              Tiếp tục mua sắm
            </Button>
          }
        >
          {orderList.length === 0 ? (
            <Empty
              description="Bạn chưa có đơn hàng nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => navigate("/")}
              >
                Mua sắm ngay
              </Button>
            </Empty>
          ) : (
            <Table
              columns={columns}
              dataSource={orderList}
              rowKey="id"
              showSorterTooltip={false}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng ${total} đơn hàng`,
              }}
            />
          )}
        </Card>
      </div>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ShoppingCartOutlined className="text-blue-600" />
            <span>Chi tiết đơn hàng #{selectedOrder?.id}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedOrder && (
          <Descriptions bordered column={2} size="middle">
            <Descriptions.Item label="Mã đơn hàng" span={2}>
              <span className="font-bold text-blue-600">
                #{selectedOrder.id}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Loại sản phẩm" span={2}>
              <Tag color="blue">
                {selectedOrder.productType === "VEHICLE"
                  ? "Xe cộ"
                  : "Ắc quy/Pin"}
              </Tag>
            </Descriptions.Item>

            {selectedOrder.vehicleBrand && (
              <>
                <Descriptions.Item label="Hãng xe">
                  {selectedOrder.vehicleBrand}
                </Descriptions.Item>
                <Descriptions.Item label="Model">
                  {selectedOrder.model}
                </Descriptions.Item>
              </>
            )}

            {selectedOrder.batteryBrand && (
              <>
                <Descriptions.Item label="Hãng ắc quy">
                  {selectedOrder.batteryBrand}
                </Descriptions.Item>
                <Descriptions.Item label="Loại ắc quy">
                  {selectedOrder.batteryType}
                </Descriptions.Item>
              </>
            )}

            <Descriptions.Item label="Giá sản phẩm">
              <span className="font-semibold text-blue-600">
                {selectedOrder.price?.toLocaleString("vi-VN")} VNĐ
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Phí vận chuyển">
              <span className="font-semibold text-orange-600">
                {selectedOrder.shippingFee?.toLocaleString("vi-VN")} VNĐ
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Phương thức giao hàng" span={2}>
              <Tag color="blue" icon={<TruckOutlined />}>
                {getDeliveryMethod(selectedOrder.deliveryMethod)}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Hình thức thanh toán" span={2}>
              <Tag
                color={selectedOrder.paymentType === "FULL" ? "green" : "gold"}
              >
                <DollarOutlined /> {getPaymentType(selectedOrder.paymentType)}
              </Tag>
            </Descriptions.Item>

            {selectedOrder.paymentType === "DEPOSIT" && (
              <>
                <Descriptions.Item label="Phần trăm đặt cọc" span={2}>
                  {selectedOrder.depositPercentage}%
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái đặt cọc" span={2}>
                  {selectedOrder.depositPaid ? (
                    <Tag color="green" icon={<CheckCircleOutlined />}>
                      Đã đặt cọc
                    </Tag>
                  ) : (
                    <Tag color="orange">Chưa đặt cọc</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền đã cọc" span={2}>
                  <span className="font-semibold text-green-600">
                    {(
                      ((selectedOrder.price) *
                        selectedOrder.depositPercentage) /
                      100
                    ).toLocaleString("vi-VN")}{" "}
                    VNĐ
                  </span>
                </Descriptions.Item>
              </>
            )}

            <Descriptions.Item label="Trạng thái đơn hàng" span={2}>
              <Tag color={getStatusConfig(selectedOrder.status).color}>
                {getStatusConfig(selectedOrder.status).text}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Ngày đặt hàng" span={2}>
              <ClockCircleOutlined className="mr-2" />
              {new Date(selectedOrder.createdAt).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Descriptions.Item>

            <Descriptions.Item label="Tổng thanh toán" span={2}>
              <div className="text-xl font-bold text-green-600">
                {(
                  selectedOrder.price + selectedOrder.shippingFee
                ).toLocaleString("vi-VN")}{" "}
                VNĐ
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal hủy đơn hàng */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CloseCircleOutlined className="text-red-600" />
            <span>Hủy đơn hàng #{selectedOrder?.id}</span>
          </div>
        }
        open={isCancelModalVisible}
        onCancel={handleCancelModalClose}
        onOk={handleCancelOrder}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        confirmLoading={cancelLoading}
        okButtonProps={{ danger: true }}
        width={500}
      >
        <Form form={cancelForm} layout="vertical">
          <p className="mb-4 text-gray-600">
            Bạn có chắc chắn muốn hủy đơn hàng này? Vui lòng nhập lý do hủy:
          </p>
          <Form.Item
            name="reason"
            label="Lý do hủy đơn"
            rules={[
              { required: true, message: "Vui lòng nhập lý do hủy đơn!" },
              { min: 10, message: "Lý do phải có ít nhất 10 ký tự!" },
              { max: 500, message: "Lý do không được quá 500 ký tự!" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Ví dụ: Tôi muốn đổi sản phẩm khác, Đặt nhầm địa chỉ..."
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
