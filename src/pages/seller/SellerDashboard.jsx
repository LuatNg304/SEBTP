"use client";
import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Table, // 1. Import Table
  Tag,
  Button,
  Modal,
  Space,
  Popconfirm, // 2. Import Space
} from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";






// --- COMPONENTS ---
const StatCard = ({ title, value, change }) => {
  const isPositive = change >= 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
  const changeClass = isPositive
    ? "text-green-500 bg-green-50"
    : "text-red-500 bg-red-50";

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 space-y-2">
      <h3 className="text-md font-medium text-gray-500">{title}</h3>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div
          className={`flex items-center text-sm font-medium p-1 rounded-full ${changeClass}`}
        >
          <ChangeIcon className="w-4 h-4 mr-1" />
          {Math.abs(change)}%
        </div>
      </div>
    </div>
  );
};

// --- TRANG DASHBOARD CHÍNH ---
export default function SellerDashboard() {
  const navigate = useNavigate();

  // 5. Thêm state cho data và loading
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 6. Thêm hàm fetchData
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/seller/posts");
      setData(res.data.data || []); // Lấy mảng data từ API
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi tải dữ liệu");
      setData([]); // Đảm bảo data là mảng dù có lỗi
    } finally {
      setLoading(false);
    }
  };

  // 7. Thêm useEffect để gọi API khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // 8. Định nghĩa hàm xử lý
  const handleView = (record) => {
    // Chuyển sang trang chi tiết (bạn cần tạo trang này trong router)
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


  // 9. Thêm cột "Hành động" vào mảng columns
  const columns = [
    
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    { title: "Loại sản phẩm", dataIndex: "productType", key: "productType" },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      render: (v) => v.toLocaleString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "POSTED"
              ? "blue"
              : status === "PENDING"
              ? "orange"
              : "green"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Nhãn Kiểm Duyệt",
      dataIndex: "trusted",
      key: "trusted",
      render: (v) =>
        v ? <Tag color="green">Premium</Tag> : <Tag color="red">Normal</Tag>,
    },
    // Thêm cột hành động
    
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
    },
  ];



  // --- RENDER ---
  return (
    <div className="min-h-screen ">
     

      <div className="bg-white p-6 rounded-xl shadow-md flex-grow">
        <h3 className="text-xl font-semibold mb-4">Quản lý tin đăng</h3>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{
            x: "max-content",
  
          }}
        />
      </div>
    </div>
  );
}
