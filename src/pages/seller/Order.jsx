"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Table, Tag, Space, Button, Popconfirm, Segmented, Card } from "antd";
import { Archive, Clock, Truck, PackageCheck } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";

// ... (Giữ nguyên getOrderStatusTag, StatCard) ...
const getOrderStatusTag = (status) => {
  let color = "gray";
  let text = "KHÔNG RÕ";
  const upperStatus = status?.toUpperCase();

  switch (upperStatus) {
    // Vận chuyển
    case "SELLER_DELIVERY":
      color = "green";
      text = "Người bán giao hàng";
      break;
    case "BUYER_PICKUP":
      color = "green";
      text = "Người mua đến lấy";
      break;
    case "GHN":
      color = "green";
      text = "Giao Hàng Nhanh";
      break;
    // phương thức thanh toán
    case "PLATFORM":
      color = "green";
      text = "Giao dịch qua nền tảng";
      break;

    // status
    case "PENDING":
      color = "orange";
      text = "Chờ xử lí";
      break;
    case "APPROVED":
      color = "green";
      text = "Chấp nhận";
      break;
    case "REJECTED":
      color = "red";
      text = "Từ chối";
      break;
    case "CANCELED":
      color = "red";
      text = "Đã hủy";
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
  // 1. Tách State: data (gốc) và filteredData (hiển thị)
  const [data, setData] = useState([]); // Dữ liệu gốc từ API (chứa cả xe và pin)
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu đã lọc để hiển thị

  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("vehicle"); // 'vehicle' | 'battery'

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    doneOrders: 0,
  });

  // --- FETCH DATA (Chỉ 1 hàm fetch) ---
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Chỉ gọi API này 1 lần
      const res = await api.get("/seller/orders");
      let incomingData =
        res.data?.data || [];
      
      const processedData = incomingData.map((item, index) => ({
        ...item,
        key: item.orderId || item.id || index,
      }));
      setData(processedData); // 2. Lưu dữ liệu gốc

      // 3. Lọc ban đầu (mặc định là 'vehicle')

      const initialFilter = processedData.filter(
        (item) => item.productType === "VEHICLE"
      );
      setFilteredData(initialFilter);
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

  // --- Tải dữ liệu lần đầu ---
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 4. Thêm useEffect để LỌC khi viewMode thay đổi
  useEffect(() => {
    setLoading(true); // Bật loading khi đang lọc

    // Giả lập độ trễ nhỏ để người dùng thấy bảng đang cập nhật
    setTimeout(() => {
      let newFilteredData = [];
      if (viewMode === "vehicle") {
        newFilteredData = data.filter((item) => item.productType === "VEHICLE");
      } else {
        newFilteredData = data.filter((item) => item.productType === "BATTERY");
      }
      setFilteredData(newFilteredData); // Cập nhật danh sách hiển thị
      setLoading(false); // Tắt loading
    }, 100); // 100ms delay
  }, [viewMode, data]); // Chạy lại khi viewMode hoặc data gốc thay đổi

  // 5. Cập nhật useEffect tính Stats để dùng 'filteredData'
  useEffect(() => {
    // Tính toán stats dựa trên danh sách ĐÃ LỌC
    const total = filteredData.length;
    const pending = filteredData.filter(
      (item) =>
        item.status?.toUpperCase() === "PENDING" ||
        item.status?.toUpperCase() === "DEPOSITED"
    ).length;
    const approved = filteredData.filter(
      (item) => item.status?.toUpperCase() === "APPROVED"
    ).length;
    const done = filteredData.filter(
      (item) => item.status?.toUpperCase() === "DONE"
    ).length;

    setStats({
      totalOrders: total,
      pendingOrders: pending,
      approvedOrders: approved,
      doneOrders: done,
    });
  }, [filteredData]); // Phụ thuộc vào filteredData

  // --- ACTIONS (Cập nhật hàm Tải lại dữ liệu) ---
  // ... (handleViewOrder, handleGoToDelivery không đổi) ...
  const handleViewOrder = (record) => {
    navigate(`/seller/order/view/${record.id}`);
  };

  const handleGoToDelivery = (record) => {
    if (!record || !record.id) {
      toast.error("Lỗi: Không tìm thấy ID của đơn hàng để giao.");
      return;
    }
    if (!record.deliveryMethod) {
      toast.error("Lỗi: Đơn hàng này thiếu phương thức vận chuyển.");
      return;
    }
    navigate(`/seller/order-deliveries/${record.id}`, {
      state: {
        deliveryMethod: record.deliveryMethod,
      },
    });
  };

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
      fetchOrders(); // 6. Chỉ cần gọi lại hàm fetchOrders gốc
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
    setIsUpdating(true);
    try {
      await api.post("/seller/orders/reject", {
        orderId: parseInt(id),
        reason: "tu choi",
      });
      toast.success(`Từ chối đơn hàng ${id} thành công!`);
      fetchOrders(); // 6. Chỉ cần gọi lại hàm fetchOrders gốc
    } catch (err) {
      console.error(`Update Error (Reject):`, err);
      toast.error(
        err.response?.data?.message || `Lỗi khi Từ chối đơn hàng ${id}`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewChange = (value) => {
    if (value === "contracts") {
      navigate("/seller/contract-management");
    }
  };

  // --- COLUMN DEFINITIONS (Không đổi) ---
  const commonColumns = [
    {
      title: "Mã Đơn hàng",
      dataIndex: "id",
      key: "id",
      render: (text) => <a className="font-medium">#{text}</a>,
      sorter: (a, b) => a.id - b.id,
    },
  ];

  const commonColumnsEnd = [
    {
      title: "Phương thức Thanh Toán",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (status) => getOrderStatusTag(status),
      filters: [
        { text: "Đặt cọc", value: "DEPOSIT" },
        { text: "Thanh toán đầy đủ", value: "FULL" },
      ],
      onFilter: (value, record) => record.paymentType?.toUpperCase() === value,
    },

    {
      title: "Trạng thái thanh toán", 
      dataIndex: "wantDeposit",
      key: "wantDeposit",
      render: (wantDeposit) => {
        
        if (wantDeposit === true) {
          // Dùng màu sắc và chữ nghĩa phù hợp với ý định đặt cọc
          return <Tag color="magenta">ĐÃ ĐẶT CỌC</Tag>;
        }
        return <Tag color="default">CHƯA ĐẶT CỌC</Tag>;
      },
      filters: [
        
        { text: "Đã đặt cọc", value: true },
        { text: "Chưa đặt cọc", value: false },
      ],
      // onFilter phải so sánh boolean
      onFilter: (value, record) => record.wantDeposit === value,
    },
    {
      title: "Phương Thức vận chuyển",
      dataIndex: "deliveryMethod",
      key: "deliveryMethod",
      render: (status) => getOrderStatusTag(status),
      filters: [
        { text: "Người bán vận chuyển", value: "SELLER_DELIVERY" },
        { text: "Người mua đến lấy", value: "BUYER_PICKUP" },
        { text: "Giao hàng nhanh", value: "GHN" },
      ],
      onFilter: (value, record) =>
        record.deliveryMethod?.toUpperCase() === value,
    },
    {
      title: "Ngày Đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY") : "N/A"),
      sorter: (a, b) =>
        dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getOrderStatusTag(status),
      filters: [
        { text: "Đã Xác Nhận", value: "APPROVED" },
        { text: "Từ chối", value: "REJECTED" },
        { text: "Đang Chờ Xử Lý", value: "PENDING" },
        { text: "Đã đặt cọc", value: "DEPOSITED" },
        { text: "Hoàn tất", value: "DONE" },
      ],
      onFilter: (value, record) => record.status?.toUpperCase() === value,
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
              Xem
            </Button>
            {(currentStatus === "PENDING" || currentStatus === "DEPOSITED") && (
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

  const vehicleColumns = [
    ...commonColumns,
    {
      title: "Hãng xe",
      dataIndex: "vehicleBrand",
      key: "vehicleBrand",
      render: (text) => <a className="font-medium">{text}</a>,
      sorter: (a, b) =>
        (a.vehicleBrand || "").localeCompare(b.vehicleBrand || ""),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      sorter: (a, b) => (a.model || "").localeCompare(b.model || ""),
    },
    ...commonColumnsEnd,
  ];

  const batteryColumns = [
    ...commonColumns,
    {
      title: "Hãng Pin",
      dataIndex: "batteryBrand",
      key: "batteryBrand",
      render: (text) => <a className="font-medium">{text || "N/A"}</a>,
      sorter: (a, b) =>
        (a.batteryBrand || "").localeCompare(b.batteryBrand || ""),
    },
    {
      title: "Loại Pin",
      dataIndex: "batteryType",
      key: "batteryType",
      render: (text) => text || "N/A",
      sorter: (a, b) =>
        (a.batteryType || "").localeCompare(b.batteryType || ""),
    },
    ...commonColumnsEnd,
  ];

  // --- RENDER JSX (Không đổi) ---
  return (
    <div className="min-h-screen bg-transparent space-y-6 flex flex-col">
      {/* Thanh chuyển trang (Order/Contract) */}
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
          value={"orders"}
          onChange={handleViewChange}
          block
          size="large"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <StatCard
          title={
            viewMode === "vehicle" ? "Tổng Đơn Hàng Xe" : "Tổng Đơn Hàng Pin"
          }
          value={stats.totalOrders}
          icon={<Archive className="w-6 h-6" />}
          colorClass="text-blue-600"
        />
        <StatCard
          title="Đang Chờ Xử Lý"
          value={stats.pendingOrders}
          icon={<Clock className="w-6 h-6" />}
          colorClass="text-orange-600"
        />
        <StatCard
          title="Đã Xác Nhận"
          value={stats.approvedOrders}
          icon={<Truck className="w-6 h-6" />}
          colorClass="text-cyan-600"
        />
        <StatCard
          title="Đã Hoàn Tất"
          value={stats.doneOrders}
          icon={<PackageCheck className="w-6 h-6" />}
          colorClass="text-green-600"
        />
      </div>

      {/* Bảng dữ liệu */}
      <Card>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <h3 className="text-xl font-semibold m-0">
              {viewMode === "vehicle"
                ? "Danh sách Đơn hàng Xe"
                : "Danh sách Đơn hàng Pin"}
            </h3>
            <Segmented
              options={[
                { label: "Đơn hàng Xe", value: "vehicle" },
                { label: "Đơn hàng Pin", value: "battery" },
              ]}
              value={viewMode}
              onChange={setViewMode}
            />
          </div>
          <div style={{ minHeight: "350px" }}>
            <Table
              columns={viewMode === "vehicle" ? vehicleColumns : batteryColumns}
              // 7. SỬ DỤNG 'filteredData'
              dataSource={filteredData}
              loading={loading || isUpdating}
              rowKey="key"
              scroll={{
                x: "max-content",
                y: 200,
              }}
              showSorterTooltip={false}
            />
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Order;
