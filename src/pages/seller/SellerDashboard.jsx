
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Space,
  Popconfirm,
  Input,
  Typography,
} from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Search } = Input;

// --- UTILITIES ---

/** MỚI: Định nghĩa trạng thái, màu sắc và bản dịch */
const statusMap = {
  POSTED: { text: "Đang hiển thị", color: "blue" },
  PENDING: { text: "Chờ duyệt", color: "orange" },
  SOLD: { text: "Đã bán", color: "green" },
  DELETED: { text: "Đã xóa", "color": "red" },
};

/** MỚI: Hàm định dạng tiền tệ (VND) */
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);
};

// --- COMPONENTS ---

/** CẬP NHẬT: StatCard sẽ ẩn % change nếu không được cung cấp */
const StatCard = ({ title, value, change }) => {
  const hasChange = typeof change === "number"; // Kiểm tra xem prop `change` có tồn tại không
  const isPositive = hasChange && change >= 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
  const changeClass = isPositive
    ? "text-green-500 bg-green-50"
    : "text-red-500 bg-red-50";

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 space-y-2">
      <h3 className="text-md font-medium text-gray-500">{title}</h3>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        
        {/* MỚI: Chỉ hiển thị khối này nếu `hasChange` là true */}
        {hasChange && (
          <div
            className={`flex items-center text-sm font-medium p-1 rounded-full ${changeClass}`}
          >
            <ChangeIcon className="w-4 h-4 mr-1" />
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  );
};

// --- TRANG DASHBOARD CHÍNH ---
export default function SellerDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/seller/posts");
      setData(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi tải dữ liệu");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleView = (record) => {
    navigate(`/seller/posts/view/${record.id}`);
  };

  const handleDelete = async (record) => {
    try {
      await api.delete(`/seller/posts/${record.id}`);
      toast.success("Xóa thành công!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi xóa");
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const productTypeFilters = useMemo(() => {
    const types = [...new Set(data.map((item) => item.productType).filter(Boolean))];
    return types.map((type) => ({ text: type, value: type }));
  }, [data]);

  // MỚI: Tính toán các số liệu thống kê
  const dashboardStats = useMemo(() => {
    // 1. Tính tổng doanh thu từ các tin "SOLD"
    const totalRevenue = data
      .filter((item) => item.status === "SOLD")
      .reduce((acc, item) => acc + (item.price || 0), 0);
    
    // 2. Tổng số tin đăng
    const totalPosts = data.length;

    // 3. Tin đang hiển thị (POSTED)
    const activePosts = data.filter(
      (item) => item.status === "POSTED"
    ).length;

    // 4. Tin chờ duyệt (PENDING)
    const pendingPosts = data.filter(
      (item) => item.status === "PENDING"
    ).length;

    return { totalRevenue, totalPosts, activePosts, pendingPosts };
  }, [data]);


  // MỚI: Tạo bộ lọc trạng thái tĩnh từ statusMap
  const statusFilters = Object.keys(statusMap).map(key => ({
    text: statusMap[key].text,
    value: key,
  }));


  // CẬP NHẬT: Cột "Trạng thái"
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "productType",
      key: "productType",
      filters: productTypeFilters,
      onFilter: (value, record) => record.productType === value,
    },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      render: (v) => formatCurrency(v), // Dùng hàm formatCurrency
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      // Cập nhật render để dùng statusMap (lấy màu và text Tiếng Việt)
      render: (status) => {
        const statusInfo = statusMap[status] || { text: status, color: "default" };
        return (
          <Tag color={statusInfo.color}>
            {statusInfo.text}
          </Tag>
        );
      },
      filters: statusFilters, // Dùng bộ lọc tĩnh đã dịch
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Nhãn Kiểm Duyệt",
      dataIndex: "trusted",
      key: "trusted",
      render: (v) =>
        v ? <Tag color="green">Premium</Tag> : <Tag color="red">Normal</Tag>,
      filters: [
        { text: "Premium", value: true },
        { text: "Normal", value: false },
      ],
      onFilter: (value, record) => record.trusted === value,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleView(record)}>
            Xem
          </Button>
          <Popconfirm
            title={`Bạn có chắc muốn xóa tin "${record.title}"?`}
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
          >
            <Button type="primary" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
      fixed: "right",
      width: 160,
    },
  ];

  // --- RENDER ---
  return (
    // Sử dụng lớp `gap-6` của Tailwind để tạo khoảng cách cho các khối
    <div className="min-h-screen p-6 flex flex-col gap-6"> 
      
      {/* MỚI: Khối thống kê (Tailwind Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng doanh thu (Đã bán)"
          value={formatCurrency(dashboardStats.totalRevenue)}
        />
        <StatCard
          title="Tổng số tin đăng"
          value={dashboardStats.totalPosts}
        />
        <StatCard
          title="Tin đang hiển thị"
          value={dashboardStats.activePosts}
        />
        <StatCard
          title="Tin chờ duyệt"
          value={dashboardStats.pendingPosts}
        />
      </div>

      {/* Khối quản lý tin đăng (bảng) */}
      <div className="bg-white p-6 rounded-xl shadow-md ">
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              Quản lý tin đăng
            </Title>
            <Search
              placeholder="Tìm kiếm tin đăng (theo tiêu đề)..."
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300 }}
            />
          </div>

          {/* Wrapper để giữ chiều cao bảng */}
          <div style={{ minHeight: "350px" }}> 
            <Table
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              scroll={{
                x: "max-content",
                y: 300,
              }}
            />
          </div>
        </Space>
      </div>
    </div>
  );
}
