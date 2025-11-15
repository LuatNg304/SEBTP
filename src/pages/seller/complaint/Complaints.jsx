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

// ==========================================================
// *** BẮT ĐẦU PHẦN CẬP NHẬT STATUS ***
// ==========================================================

// --- DANH SÁCH LỌC (ĐÃ CẬP NHẬT) ---
const STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  // Trạng thái chờ/Review
  { value: "PENDING", label: "Chờ xử lý" }, // Giữ lại PENDING chung
  { value: "SELLER_REVIEWING", label: "Chờ người bán xử lý" },
  { value: "ADMIN_REVIEWING", label: "Admin đang xem xét" },
  { value: "ADMIN_SOLVING", label: "Admin đang giải quyết" },
  { value: "RESOLUTION_GIVEN", label: "Đã phản hồi" }, // Giữ lại

  // Trạng thái từ chối
  { value: "REJECTED", label: "Đã từ chối" }, // Giữ lại REJECTED chung
  { value: "SELLER_REJECTED", label: "Người bán từ chối" },
  { value: "BUYER_REJECTED", label: "Người mua từ chối" },

  // Trạng thái giải quyết/Đóng
  { value: "RESOLVED", label: "Đã giải quyết" }, // Giữ lại RESOLVED chung
  { value: "SELLER_RESOLVED", label: "Người bán đã giải quyết" },
  { value: "CLOSED_REFUND", label: "Đã đóng (Đã hoàn tiền)" },
  { value: "CLOSED_NO_REFUND", label: "Đã đóng (Không hoàn tiền)" },
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
 * 2. Tạo Tag AntD cho trạng thái (ĐÃ CẬP NHẬT)
 */
const getComplaintTag = (status) => {
  let color = "default";
  let text = status;

  // Ánh xạ status sang màu sắc và text
  const statusMap = {
    // --- Trạng thái Chờ/Review ---
    PENDING: { color: "orange", text: "Chờ xử lý" },
    SELLER_REVIEWING: { color: "blue", text: "Chờ người bán xử lý" },
    RESOLUTION_GIVEN: { color: "blue", text: "Đã phản hồi" },
    ADMIN_REVIEWING: { color: "purple", text: "Admin đang xem xét" },
    ADMIN_SOLVING: { color: "purple", text: "Admin đang giải quyết" },

    // --- Trạng thái Từ chối ---
    REJECTED: { color: "red", text: "Đã từ chối" },
    SELLER_REJECTED: { color: "red", text: "Người bán từ chối" },
    BUYER_REJECTED: { color: "red", text: "Người mua từ chối" },

    // --- Trạng thái Đã giải quyết/Đóng ---
    RESOLVED: { color: "green", text: "Đã giải quyết" },
    SELLER_RESOLVED: { color: "green", text: "Người bán đã giải quyết" },
    CLOSED_REFUND: { color: "green", text: "Đã đóng (Đã hoàn tiền)" },
    CLOSED_NO_REFUND: { color: "default", text: "Đã đóng (Không hoàn tiền)" },

    // --- Loại khiếu nại (giữ nguyên) ---
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
// ==========================================================
// *** KẾT THÚC PHẦN CẬP NHẬT STATUS ***
// ==========================================================

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
                y: 300,
              }}
            />
          </div>
        </div>
      </Space>
    </div>
  );
}
