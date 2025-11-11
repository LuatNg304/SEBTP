"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Select,
  Spin,
  Typography,
  Space,
  Result,
} from "antd"; // 1. Import component AntD
import { Eye, ShieldAlert } from "lucide-react"; // Giữ lại icon
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../config/axios";

// --- Constants ---
const { Title } = Typography;
const { Option } = Select;

// --- DANH SÁCH LỌC (Không đổi) ---
const STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "RESOLUTION_GIVEN", label: "Đã phản hồi" },
  { value: "ADMIN_SOLVING", label: "Admin đang giải quyết" },
  { value: "RESOLVED", label: "Đã giải quyết" },
  { value: "REJECTED", label: "Đã từ chối" },
];

// --- HELPER FUNCTIONS ---
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * 2. Tạo Tag AntD cho trạng thái
 */
const getComplaintTag = (status) => {
  let color = "default";
  let text = status;

  // Ánh xạ status sang màu sắc và text
  const statusMap = {
    // Status
    PENDING: { color: "orange", text: "Chờ xử lý" },
    RESOLUTION_GIVEN: { color: "blue", text: "Đã phản hồi" },
    RESOLVED: { color: "green", text: "Đã giải quyết" },
    REJECTED: { color: "red", text: "Đã từ chối" },
    ADMIN_SOLVING: { color: "purple", text: "Admin đang giải quyết" },
    // Loại khiếu nại
    DAMAGED_PRODUCT: { color: "yellow", text: "Sản phẩm bị hỏng" },
    WRONG_ITEM: { color: "yellow", text: "Giao sai sản phẩm" },
    NOT_AS_DESCRIBED: { color: "yellow", text: "Không đúng mô tả" },
  };

  if (statusMap[status]) {
    color = statusMap[status].color;
    text = statusMap[status].text;
  }

  return <Tag color={color}>{text}</Tag>;
};

// === THÀNH PHẦN CHÍNH ===

export default function ComplaintListAntD() {
  const [complaints, setComplaints] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- LOGIC (Không đổi) ---
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const res = await api.get("/seller/complaints/list");
        const data = res.data.data || res.data;
        if (res.data.success && Array.isArray(data)) {
          setComplaints(data);
          setFilteredList(data);
        } else {
          throw new Error(res.data.message || "Định dạng dữ liệu không đúng");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Lỗi không xác định";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  useEffect(() => {
    if (selectedStatus === "ALL") {
      setFilteredList(complaints);
    } else {
      const filtered = complaints.filter(
        (complaint) => complaint.status === selectedStatus
      );
      setFilteredList(filtered);
    }
  }, [selectedStatus, complaints]);

  const handleViewDetails = (id) => {
    console.log(id);
    navigate(`/seller/complaints/${id}`);
  };

  // --- 3. ĐỊNH NGHĨA CỘT CHO BẢNG ANTD ---
  const columns = [
    {
      title: "Mã Đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <a>#{text}</a>,
    },
    {
      title: "Người khiếu nại",
      dataIndex: "buyerName",
      key: "buyerName",
    },
    {
      title: "Tiêu đề",
      dataIndex: "type",
      key: "type",
      render: (type) => getComplaintTag(type),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getComplaintTag(status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDate(text),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          icon={<Eye className="w-4 h-4" />}
          onClick={() => handleViewDetails(record.id)}
        >
          Xem
        </Button>
      ),
    },
  ];

  // --- 4. RENDER UI ĐÃ CHUYỂN ĐỔI ---

  if (loading) {
    return (
      // Dùng <Spin> của AntD
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      // Dùng <Result> của AntD
      <Result
        status="error"
        title="Lỗi khi tải danh sách khiếu nại"
        subTitle={error}
        extra={
          <Button type="primary" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        }
      />
    );
  }

  // Văn bản khi bảng trống
  const emptyText =
    selectedStatus === "ALL"
      ? "Không tìm thấy khiếu nại nào."
      : "Không tìm thấy khiếu nại phù hợp.";

  // Màn hình chính
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Dùng Space của AntD để căn chỉnh */}
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Header */}
        <Space align="center" size="middle">
          <ShieldAlert className="w-8 h-8 text-red-600" />
          <Title level={2} style={{ margin: 0 }}>
            Quản lý Khiếu nại
          </Title>
        </Space>

        {/* Bảng dữ liệu (Gói trong 1 div để có bóng và padding) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* 5. Bộ lọc dùng <Select> của AntD */}
          <div className="mb-4">
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Lọc theo trạng thái
            </label>
            <Select
              id="status-filter"
              value={selectedStatus}
              onChange={(value) => setSelectedStatus(value)} // AntD Select trả về value trực tiếp
              style={{ width: 240 }}
            >
              {STATUS_FILTER_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>

          {/* 6. Bảng dữ liệu dùng <Table> của AntD */}
          <div style={{ minHeight: "350px" }}>
            <Table
              columns={columns}
              dataSource={filteredList}
              loading={loading}
              rowKey="id"
              locale={{ emptyText: emptyText }}
             scroll={{
                x: "max-content",
                y: 300,}}
            />
          </div>
        </div>
      </Space>
    </div>
  );
}
