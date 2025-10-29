"use client";
import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Button, Popconfirm, Card, Statistic } from "antd";
import { Archive, Clock, Truck, PackageCheck } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import api from "../../config/axios"; // 1. Dùng instance 'api'

// --- MOCK STATS DATA ---
const orderStats = {
  totalOrders: 250,
  pendingOrders: 15,
  shippedOrders: 30,
  deliveredOrders: 205,
};

// --- HELPER COMPONENTS ---
const getStatusTag = (status) => {
  let color = "gray";
  let text = "KHÔNG RÕ";
  const upperStatus = status?.toUpperCase();

  switch (upperStatus) {
    case "PENDING":
      color = "orange";
      text = "Đang Chờ Xử Lý";
      break;
    case "CONFIRMED":
      color = "blue";
      text = "Đã Xác Nhận";
      break;
    case "SHIPPING":
      color = "cyan";
      text = "Đang Vận Chuyển";
      break;
    case "DELIVERED":
      color = "green";
      text = "Đã Giao Hàng";
      break;
    case "REJECTED": // Thêm trạng thái REJECTED
    case "CANCELLED":
      color = "red";
      text = "Đã Hủy/Từ chối";
      break;
    default:
      text = status || "Không rõ";
  }
  return <Tag color={color}>{text.toUpperCase()}</Tag>;
};

const StatCard = ({ title, value, icon, colorClass = "text-gray-900" }) => (
  <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 space-y-2">
    <h3 className="text-md font-medium text-gray-500">{title}</h3>
    <div className="flex justify-between items-center">
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      <div className="text-gray-400">{icon}</div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const Order = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- FETCH ORDERS ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/seller/orders");
      let incomingData =
        res.data?.data || (Array.isArray(res.data) ? res.data : []);

      const processedData = incomingData.map((item, index) => ({
        ...item,
        key: item.orderId || item.id || index,
      }));

      setData(processedData);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error(
        err.response?.data?.message || "Không thể tải dữ liệu đơn hàng."
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- VIEW DETAILS ---
  const handleView = (record) => {
    toast.info(
      `Mã Đơn: ${record.orderId}, Khách: ${record.buyerName}, Trạng Thái: ${
        record.status || "N/A"
      }`
    );
  };

  // --- (XÓA HÀM callOrderActionApi CŨ) ---

  // --- HÀM MỚI: Phê duyệt (Approve) ---
  const handleApprove = async (record) => {
    const { orderId } = record;
    if (!orderId) {
      toast.error("Không có 'orderId' để phê duyệt.");
      return;
    }

    setIsUpdating(true);
    try {
      // Dùng POST (không phải GET) và gửi orderId trong body
      await api.get(`/seller/orders/approve?orderId=${orderId}`);

      toast.success(`Phê duyệt đơn hàng ${orderId} thành công!`);
      fetchData(); // Tải lại data
    } catch (err) {
      console.error(`Update Error (Approve):`, err);
      toast.error(
        err.response?.data?.message || `Lỗi khi Phê duyệt đơn hàng ${orderId}`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // --- HÀM MỚI: Từ chối (Reject) ---
  const handleReject = async (record) => {
    const { orderId } = record;
    if (!orderId) {
      toast.error("Không có 'orderId' để từ chối.");
      return;
    }
    console.log("Đang từ chối orderId:", orderId);
    setIsUpdating(true);
    try {
      // Dùng POST và gửi orderId trong body theo yêu cầu
      await api.post(
        "/seller/orders/reject",
        
        {
          id: parseInt(orderId),
          reason: "tu chou",
        }
      );
   
    
      toast.success(`Từ chối đơn hàng ${orderId} thành công!`);
      fetchData(); // Tải lại data
    } catch (err) {
      console.error(`Update Error (Reject):`, err);
      toast.error(
        err.response?.data?.message || `Lỗi khi Từ chối đơn hàng ${orderId}`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Tương tự, bạn sẽ cần tạo hàm cho 'ship' và 'deliver'
  // const handleShip = async (record) => { ... }
  // const handleDeliver = async (record) => { ... }

  // --- TABLE COLUMNS (ĐÃ CẬP NHẬT) ---
  const columns = [
    // ... (các cột Mã Đơn Hàng, Tên Khách, v.v. giữ nguyên) ...
    {
      title: "Mã Đơn Hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <a className="font-medium">{text}</a>,
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: "buyerName",
      key: "buyerName",
    },
    {
      title: "Phương thức TT",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (type) => (
        <Tag color={type === "DEPOSIT" ? "purple" : "blue"}>{type}</Tag>
      ),
    },
    {
      title: "Vận chuyển",
      dataIndex: "deliveryMethod",
      key: "deliveryMethod",
    },
    {
      title: "Ngày Đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Hành Động",
      key: "action",
      fixed: "right",
      width: 250,
      render: (_, record) => {
        const currentStatus = record.status?.toUpperCase();

        return (
          <Space size="small">
            <Button type="link" onClick={() => handleView(record)}>
              Xem
            </Button>

            {/* CẬP NHẬT onConfirm ĐỂ GỌI HÀM MỚI */}
            {currentStatus === "PENDING" && (
              <>
                <Popconfirm
                  title="Xác nhận đơn hàng này?"
                  onConfirm={() => handleApprove(record)} // <-- SỬA
                  okText="Xác nhận"
                  cancelText="Hủy"
                  disabled={isUpdating}
                >
                  <Button type="link" loading={isUpdating}>
                    Xác nhận
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="Bạn có chắc muốn từ chối?"
                  onConfirm={() => handleReject(record)} // <-- SỬA
                  okText="Từ chối"
                  cancelText="Không"
                  disabled={isUpdating}
                  okType="danger"
                >
                  <Button type="link" danger loading={isUpdating}>
                    Từ chối
                  </Button>
                </Popconfirm>
              </>
            )}

            {currentStatus === "CONFIRMED" && (
              <Popconfirm
                title="Giao hàng cho đơn này?"
                // onConfirm={() => handleShip(record)} // <-- Bạn cần tạo hàm này
                okText="Giao hàng"
                cancelText="Hủy"
                disabled={isUpdating}
              >
                <Button typeF="link" loading={isUpdating}>
                  Giao hàng
                </Button>
              </Popconfirm>
            )}

            {currentStatus === "SHIPPING" && (
              <Popconfirm
                title="Đã giao hàng thành công?"
                // onConfirm={() => handleDeliver(record)} // <-- Bạn cần tạo hàm này
                okText="Đã giao"
                cancelText="Hủy"
                disabled={isUpdating}
              >
                <Button type="link" loading={isUpdating}>
                  Đã giao
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  // --- RENDER JSX (Không thay đổi) ---
  return (
    <div className="min-h-screen bg-transparent">
      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Tổng Đơn Hàng"
          value={orderStats.totalOrders}
          icon={<Archive className="w-6 h-6" />}
          colorClass="text-blue-600"
        />
        <StatCard
          title="Đang Chờ Xử Lý"
          value={orderStats.pendingOrders}
          icon={<Clock className="w-6 h-6" />}
          colorClass="text-orange-600"
        />
        <StatCard
          title="Đang Vận Chuyển"
          value={orderStats.shippedOrders}
          icon={<Truck className="w-6 h-6" />}
          colorClass="text-cyan-600"
        />
        <StatCard
          title="Đã Giao Thành Công"
          value={orderStats.deliveredOrders}
          icon={<PackageCheck className="w-6 h-6" />}
          colorClass="text-green-600"
        />
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Quản lý tin đăng</h3>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="key"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default Order;
