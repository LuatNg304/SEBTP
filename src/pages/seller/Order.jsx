"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  Segmented, // Thêm Segmented
  Statistic, // Giữ lại Statistic
} from "antd";
// 1. Thêm FileText
import {
  Archive,
  Clock,
  Truck,
  PackageCheck,
  FileText, // <-- THÊM
} from "lucide-react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";

// --- MOCK STATS DATA ---
const orderStats = {
  totalOrders: 250,
  pendingOrders: 15,
  shippedOrders: 30,
  deliveredOrders: 205,
};

// --- HELPER COMPONENTS ---

const getOrderStatusTag = (status) => {
  let color = "gray";
  let text = "KHÔNG RÕ";
  const upperStatus = status?.toUpperCase();

  switch (upperStatus) {
    case "PENDING":
      color = "orange";
      text = "Đang Chờ Xử Lý";
      break;
    case "APPROVED":
      color = "green";
      text = "Đã Xác Nhận";
      break;
    case "DONE":
      color = "green";
      text = "Hoàn tất";
      break;
    case "REJECTED":
      color = "red";
      text = "Đã Hủy/Từ chối";
      break;
    case "DEPOSITED":
      color = "red";
      text = "Đã đặt cọc";
      break;
    default:
      text = status || "Không rõ";
  }
  return <Tag color={color}>{text.toUpperCase()}</Tag>;
};

const getContractStatusTag = (status) => {
  let color = "gray";
  let text = "KHÔNG RÕ";
  const upperStatus = status?.toUpperCase();

  switch (upperStatus) {
    case "PENDING":
      color = "orange";
      text = "Chờ Ký";
      break;
    case "SIGNED":
      color = "blue";
      text = "Đã Ký";
      break;
    case "CANCELLED":
      color = "red";
      text = "Đã Hủy";
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
  const [view, setView] = useState("orders"); // 'orders' hoặc 'contracts'
  const navigate = useNavigate();

  // --- FETCH DATA ---
  const fetchOrders = useCallback(async () => {
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
      console.error("Fetch Orders Error:", err);
      toast.error(
        err.response?.data?.message || "Không thể tải dữ liệu đơn hàng."
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/seller/contracts");
      let incomingData =
        res.data?.data || (Array.isArray(res.data) ? res.data : []);
      const processedData = incomingData.map((item, index) => ({
        ...item,
        key: item.contractId || item.id || index,
      }));
      setData(processedData);
    } catch (err) {
      console.error("Fetch Contracts Error:", err);
      toast.error(
        err.response?.data?.message || "Không thể tải dữ liệu hợp đồng."
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === "orders") {
      fetchOrders();
    } else if (view === "contracts") {
      fetchContracts();
    }
  }, [view, fetchOrders, fetchContracts]);

  // --- VIEW DETAILS ---
  const handleViewOrder = (record) => {
    navigate(`/seller/order/view/${record.id}`);
  };
  const handleViewContract = (record) => {
    navigate(`/seller/contract/view/${record.id}`);
  };

  const handleGoToDelivery = (record) => {
    // Điều hướng đến trang chi tiết giao hàng với ID của đơn hàng
    navigate(`/seller/order-deliveries/${record.id}`);
  };

  // --- ORDER ACTIONS ---
  const handleApprove = async (record) => {
    const { id } = record;
    if (!id) {
      toast.error("Không có 'id' để phê duyệt.");
      return;
    }
    setIsUpdating(true);
    try {
      await api.get(`/seller/orders/approve?orderId=${id}`);
      toast.success(`Phê duyệt đơn hàng ${id} thành công!`);
      fetchOrders(); // <-- 2. SỬA LỖI: Thêm ()
    } catch (err) {
      console.error(`Update Error (Approve):`, err);
      toast.error(
        err.response?.data?.message || `Lỗi khi Phê duyệt đơn hàng ${id}`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async (record) => {
    const { id } = record;
    if (!id) {
      toast.error("Không có 'orderId' để từ chối.");
      return;
    }
    // Sửa lỗi typo IDBIndex -> id
    console.log("Đang từ chối orderId:", id);
    setIsUpdating(true);
    try {
      await api.post("/seller/orders/reject", {
        id: parseInt(id),
        reason: "tu chou",
      });
      toast.success(`Từ chối đơn hàng ${id} thành công!`);
      fetchOrders(); // <-- 2. SỬA LỖI: Thêm ()
    } catch (err) {
      console.error(`Update Error (Reject):`, err);
      toast.error(
        err.response?.data?.message || `Lỗi khi Từ chối đơn hàng ${id}`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // -

  // 3. DI CHUYỂN contractColumns ra ngoài
  const contractColumns = [
    {
      title: "Mã Hợp Đồng",
      dataIndex: "id", // Giả sử là 'id'
      key: "id",
      render: (text) => <a className="font-medium">#{text}</a>,
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: "buyerName", // Giả sử
      key: "buyerName",
    },
    
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getContractStatusTag(status), // Dùng helper của Contract
    },
    {
      title: "Hành Động",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => handleViewContract(record)}>
            Xem Chi Tiết
          </Button>
        </Space>
      ),
    },
  ];

  const orderColumns = [
    {
      title: "Hãng xe",
      dataIndex: "vehicleBrand",
      key: "vehicleBrand",
      render: (text) => <a className="font-medium">{text}</a>,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
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
      render: (status) => getOrderStatusTag(status),
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
            <Button type="link" onClick={() => handleViewOrder(record)}>
              {" "}
              {/* 4. SỬA LỖI: handleView -> handleViewOrder */}
              Xem
            </Button>

            {(currentStatus === "PENDING" ||
              currentStatus === "DEPOSITED") && (
                <>
                  <Popconfirm
                    title="Xác nhận đơn hàng này?"
                    onConfirm={() => handleApprove(record)}
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
                    onConfirm={() => handleReject(record)}
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
            {currentStatus === "APPROVED" && (
              <Button
                type="link"
                onClick={() => handleGoToDelivery(record)}
                className="text-blue-600"
              >
                Giao hàng
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  // --- RENDER JSX ---
  return (
    <div className="min-h-screen bg-transparent space-y-6 flex flex-col">
      {/* Bộ lọc Segmented */}
      <div className="bg-dark p-5 rounded-xl ">
        <Segmented
          options={[
            {
              label: "Quản lý Đơn Hàng",
              value: "orders",
            },
            {
              label: "Quản lý Hợp Đồng",
              value: "contracts",
            },
          ]}
          value={view}
          onChange={setView}
          block
          size="large"
        />
      </div>

      {/* Ẩn thống kê khi xem hợp đồng */}
      {view === "orders" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
            // 5. XÓA 'WANNAFIX'
          />
        </div>
      )}

      {/* Bảng dữ liệu */}
      <div className="bg-white p-6 rounded-xl shadow-md flex-grow">
        <h3 className="text-xl font-semibold mb-4">
          {view === "orders" ? "Danh sách Đơn hàng" : "Danh sách Hợp đồng"}
        </h3>

        <Table
          columns={view === "orders" ? orderColumns : contractColumns}
          dataSource={data}
          loading={loading || (view === "orders" && isUpdating)}
          rowKey="key"
          scroll={{
            x: "max-content",
         
          }}
        />
      </div>
    </div>
  );
};

export default Order;
